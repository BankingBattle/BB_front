import { useTranslation } from 'react-i18next';
import { useLoaderData } from 'react-router-dom';
import { z } from 'zod';
import { api, query } from '../api';
import { getRoundResponse, round } from '../api/round';
import { queryClient } from '../main';
import React, { useEffect, useState } from 'react';
import { Game } from '../models/Game';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown } from '@fortawesome/free-solid-svg-icons';

export const loader = async ({ params }: { params: { id: string } }) => {
  return queryClient.fetchQuery({
    queryFn: () => api.round({ params }),
    queryKey: query.getKeyByAlias('round', { params }),
    staleTime: 1000,
  });
};

interface IFileState {
  file: File
  chosen: boolean
  uploading: boolean
  uploaded: boolean
  error: string
}


function Round() {
  const { t } = useTranslation();
  const { response_data } = useLoaderData() as z.infer<typeof getRoundResponse>;

  const [game, setGame] = useState({} as any);
  const [error, setError] = useState('');

  const [featureFileState, setFeatureFileState] = useState({
    file: {} as File,
    chosen: false,
    uploading: false,
    uploaded: false,
    error: '',
  } as IFileState);

  const [currentRoundData, setCurrentRoundData] = useState('');

  useEffect(() => {
    if (!response_data) {
      return;
    }

    // fetch round game info
    queryClient.fetchQuery({
      queryFn: () => api.game({ params: {id: response_data.game_id} }),
      queryKey: query.getKeyByAlias('game', { params: {id: response_data.game_id} }),
      staleTime: 1000,
    }).then(response => {
      if (!response?.response_data) {
        setError(`Couldn't load round game info: ${response?.message}`);
      } else {
        setGame(response.response_data);
      }
    });

    // fetch round data info
    queryClient.fetchQuery({
      queryFn: () => api.round_data({params: {id: response_data.id}}),
      queryKey: query.getKeyByAlias('round_data', {params: {id: response_data.id}}),
      staleTime: 1000,
    }).then(response => {
      if (response.message) {
        // No data in round
      } else {
        // Data presents
        setCurrentRoundData(JSON.stringify(response));
      }
    }).catch(err => {
      console.log(err);
      setError(err);
    });


  }, []);

  const clearDataContent = () => {
    return currentRoundData
      .replaceAll('"', '')
      .replaceAll('?', '')
      .trim();
  }

  const chooseFeatureFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;
    const selectedFiles = files as FileList;

    setFeatureFileState({
      ...featureFileState,
      file: selectedFiles?.[0],
      chosen: true,
    });
  }

  const uploadFeatures = async () => {
    if (!featureFileState.chosen || featureFileState.uploaded || !response_data) {
      return;
    }

    let formData = new FormData();

    // @ts-ignore
    formData.append("file", featureFileState.file, featureFileState.file.name);
    // @ts-ignore
    formData.append("round_id", response_data.id.toString());

    try {
      setFeatureFileState({...featureFileState, uploading: true});

      await queryClient.fetchQuery({
        queryFn: () => api.upload_data(formData, {params: {id: response_data.id}}),
        queryKey: query.getKeyByAlias('upload_data', {
          params: {id: response_data.id},
          headers: {
            'Content-Disposition': featureFileState.file.name
          }
        }),
        staleTime: 1000,
      });

      setFeatureFileState({...featureFileState, uploaded: true});

    } catch (err) {
      setFeatureFileState({...featureFileState, error: String(err)});
      console.log(err);
    } finally {
      setFeatureFileState({...featureFileState, uploading: false});
    }

  }



  return (
    <div className="lg:w-full mx-3 mx-auto bg-white p-10 lg:rounded-3xl shadow-2xl">

      <div className="flex justify-center">
        <div
          className={`w-5 h-5 rounded-2xl mt-2 mr-2 bg-${response_data?.is_active ? "green" : "amber"}-500`}
          title={response_data?.is_active ? "Active" : "Not active"}
        />
        <h1 className="text-3xl">{t('Round')}: {response_data?.name}</h1>
      </div>

      <h3 className="flex justify-center text-gray-600 text-xl">
        {t('Game')}:&nbsp;
        <a
          className="text-gray-700 hover:text-blue-600 transition-colors"
          href={`../game/${response_data?.game_id}`}>
          {game.name}
        </a>
      </h3>
      <h3 className="flex justify-center text-gray-500">{response_data?.description}</h3>

      <div className="flex flex-col w-full mt-5">
        <div className="flex flex-col lg:flex-row w-full">
          <div className="flex flex-col lg:w-1/2 h-full">

            <div className="flex flex-row p-5 mb-4 lg:rounded-xl shadow-sm bg-gray-100">
              <form
                className="mx-1 my-1 w-1/2"
                action={`data:application/octet-stream,${clearDataContent()}`}>
                <button
                  type="submit"
                  disabled={!Boolean(currentRoundData)}
                  className="px-3 py-2 rounded-md transition-colors w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white"
                >
                  <FontAwesomeIcon icon={faArrowDown} />
                  &nbsp;&nbsp;{t('Features')}
                </button>
              </form>

              <form
                className="mx-1 my-1 w-1/2"
                action="data:application/octet-stream">
                <button
                  type="submit"
                  disabled={!Boolean(currentRoundData)}
                  className="px-3 py-2 rounded-md transition-colors w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white"
                >
                  <FontAwesomeIcon icon={faArrowDown} />
                  &nbsp;&nbsp;{t('Tests')}
                </button>
              </form>
            </div>

            <div className="p-5 mb-4 lg:rounded-xl shadow-sm bg-gray-100">
              {/* FEATURES UPLOADING */}
              <div>
                <label>Upload features (*.csv)</label>
                {featureFileState.chosen
                  ? <div className="flex flex-row mx-1 my-1 px-3 py-2">
                    <label className={`mt-2 mr-2 ${featureFileState.error ? "text-red-700" : "text-black"}`}>
                      {featureFileState.error ? featureFileState.error : featureFileState.file.name}
                    </label>
                    <button
                      onClick={uploadFeatures}
                      disabled={featureFileState.uploading || featureFileState.uploaded}
                      className="px-3 py-2 rounded-md transition-colors bg-purple-500 hover:bg-purple-600 text-white">
                      {featureFileState.uploading ? "Uploading..." : (
                        featureFileState.uploaded ? "Uploaded" : "Upload"
                      )}
                    </button>
                  </div>
                  : <input
                      type="file"
                      disabled={Boolean(currentRoundData)}
                      onChange={chooseFeatureFile}
                      className="mx-1 my-1 px-3 py-2 rounded-md transition-colors w-full bg-purple-500 disabled:bg-gray-300 text-white"
                    />
                }
              </div>

              <br />

              {/* TEST UPLOADING */}
              <div>
                <label>Upload tests (*.csv)</label>
                <input
                  type="file"
                  disabled={true}
                  className="mx-1 my-1 px-3 py-2 rounded-md transition-colors w-full bg-purple-500 disabled:bg-gray-300 text-white"
                />
              </div>

            </div>

            <div className="p-5 lg:rounded-xl shadow-sm bg-gray-100">
              <h1 className="flex justify-center text-xl antialiased uppercase">
                {t('Upload solution')}
              </h1>
              <input
                className="mx-1 mt-5 px-3 py-2 rounded-md block text-white cursor-pointer bg-gray-500"
                id="file_input" type="file"
              />
              <button
                className="mx-1 px-3 py-2 rounded-md transition-colors mt-8 bg-purple-500 hover:bg-purple-600 text-white"
              >{t('Send')}</button>
            </div>
          </div>

          <div className="p-5 lg:ml-4 mt-4 lg:mt-0 lg:rounded-xl shadow-sm bg-gray-100 w-full">
            <h1 className="flex justify-center text-xl antialiased uppercase mb-5">
              {t('Your team submits')}
            </h1>
            <table className="table-auto lg:w-full">
              <thead className="border-b">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium">ID</th>
                  <th className="px-6 py-4 text-left text-sm font-medium">{t('Date')}</th>
                  <th className="px-6 py-4 text-left text-sm font-medium">{t('Filename')}</th>
                  <th className="px-6 py-4 text-left text-sm font-medium">{t('Result')}</th>
                  <th className="px-6 py-4 text-left text-sm font-medium"></th>
                </tr>
              </thead>
              <tbody>
              {mockSubmits.map(submit => (
                <tr className="border-b">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{submit.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{submit.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{submit.filename}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{submit.result}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="mx-1 my-1 px-3 py-2 rounded-md bg-purple-500 hover:bg-purple-600 text-white">
                      Download
                    </button>
                  </td>
                </tr>
              ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Round;

const mockSubmits = [
  {
    id: 1,
    date: '2022-02-24 05:14',
    filename: 'test1.go',
    result: '4'
  },
  {
    id: 2,
    date: '2022-02-24 05:28',
    filename: 'test2.go',
    result: '18'
  },
  {
    id: 3,
    date: '2022-02-24 06:03',
    filename: 'test3.go',
    result: '33'
  }
]