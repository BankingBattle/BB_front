import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLoaderData } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { api, query } from '../api';
import { queryClient } from '../main';
import type { Round as RoundType } from '../api/round';
import { A } from '../components/A';

export const loader = async ({ params }: { params: { id: string } }) => {
  return queryClient.fetchQuery({
    queryFn: () => api.round({ params }),
    queryKey: query.getKeyByAlias('round', { params }),
    staleTime: 1000,
  });
};

interface IFileState {
  file: File;
  chosen: boolean;
  uploading: boolean;
  uploaded: boolean;
  error: string;
}

function Round() {
  const { t } = useTranslation();
  const round = useLoaderData() as RoundType;
  const { data: game } = query.useGame({ params: { id: round.game_id } });
  const { data: roundData } = query.useRoundData({
    params: { id: round.id },
  });
  const { mutate: uploadData, error: _error } = query.useUploadData({
    params: { id: round.id },
  });

  const [featureFileState, setFeatureFileState] = useState({
    file: {} as File,
    chosen: false,
    uploading: false,
    uploaded: false,
    error: '',
  } as IFileState);

  const clearDataContent = () => {
    return roundData?.replace(/\?|\"/g, '');
  };

  const chooseFeatureFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;
    const selectedFiles = files as FileList;

    setFeatureFileState({
      ...featureFileState,
      file: selectedFiles?.[0],
      chosen: true,
    });
  };

  const uploadFeatures = async () => {
    if (!featureFileState.chosen || featureFileState.uploaded || !round) {
      return;
    }

    await uploadData({
      round_id: round.id,
      file: featureFileState.file,
    });
  };

  return (
    <div className="lg:w-full mx-auto bg-white py-5 lg:p-10 lg:rounded-3xl shadow-2xl">
      <div className="flex justify-center">
        <div
          className={`w-5 h-5 rounded-2xl mt-2 mr-2 bg-${
            round.is_active ? 'green' : 'amber'
          }-500`}
          title={round.is_active ? 'Active' : 'Not active'}
        />
        <h1 className="text-3xl">
          {t('Round')}: {round.name}
        </h1>
      </div>

      {game && (
        <h3 className="flex justify-center text-gray-600 text-xl">
          {t('Game')}:&nbsp;
          <A
            className="text-gray-700 hover:text-blue-600 transition-colors"
            to={`../game/${round.game_id}`}
          >
            {game.name}
          </A>
        </h3>
      )}

      <h3 className="flex justify-center text-gray-500">{round.description}</h3>

      <div className="flex flex-col w-full mt-5">
        <div className="flex flex-col lg:flex-row w-full">
          <div className="flex flex-col lg:w-1/2 h-full">
            <div className="flex flex-row p-5 mb-4 lg:rounded-xl shadow-sm bg-gray-100">
              <form
                className="mx-1 my-1 w-1/2"
                action={`data:application/octet-stream,${clearDataContent()}`}
              >
                <button
                  type="submit"
                  disabled={Boolean(roundData)}
                  className="px-3 py-2 rounded-md transition-colors w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white"
                >
                  <FontAwesomeIcon icon={faArrowDown} />
                  &nbsp;&nbsp;{t('Features')}
                </button>
              </form>

              <form
                className="mx-1 my-1 w-1/2"
                action={`data:application/octet-stream,${clearDataContent()}`}
              >
                <button
                  type="submit"
                  disabled={!roundData}
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
                {featureFileState.chosen ? (
                  <div className="flex flex-row mx-1 my-1 px-3 py-2">
                    <label
                      className={`mt-2 mr-2 ${
                        featureFileState.error ? 'text-red-700' : 'text-black'
                      }`}
                    >
                      {featureFileState.error
                        ? featureFileState.error
                        : featureFileState.file.name}
                    </label>
                    <button
                      onClick={uploadFeatures}
                      disabled={
                        featureFileState.uploading || featureFileState.uploaded
                      }
                      className="px-3 py-2 rounded-md transition-colors bg-purple-500 hover:bg-purple-600 text-white"
                    >
                      {featureFileState.uploading
                        ? 'Uploading...'
                        : featureFileState.uploaded
                        ? 'Uploaded'
                        : 'Upload'}
                    </button>
                  </div>
                ) : (
                  <input
                    type="file"
                    disabled={Boolean(roundData)}
                    onChange={chooseFeatureFile}
                    className="mx-1 my-1 px-3 py-2 rounded-md transition-colors w-full bg-purple-500 disabled:bg-gray-300 text-white"
                  />
                )}
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
                className="mt-5 px-3 py-2 w-full rounded-md block text-white cursor-pointer bg-gray-500"
                id="file_input"
                type="file"
              />
              <button className="px-3 py-2 w-full rounded-md transition-colors mt-8 bg-purple-500 hover:bg-purple-600 text-white">
                {t('Send')}
              </button>
            </div>
          </div>

          <div className="p-5 lg:ml-4 mt-4 lg:mt-0 lg:rounded-xl shadow-sm bg-gray-100 w-full">
            <h1 className="flex justify-center text-xl antialiased uppercase mb-5">
              {t('Your team submits')}
            </h1>
            <table className="table-fixed lg:w-full border-separate border-spacing-y-6 border-spacing-x-4">
              <thead className="border-b border-gray-500 text-left">
                <tr>
                  <th className="w-6">ID</th>
                  <th>{t('Date')}</th>
                  <th>{t('Filename')}</th>
                  <th>{t('Result')}</th>
                  <th className="w-24"></th>
                </tr>
              </thead>
              <tbody>
                {mockSubmits.map((submit) => (
                  <tr key={submit.id} className="whitespace-nowrap font-medium">
                    <td>{submit.id}</td>
                    <td>{submit.date}</td>
                    <td>{submit.filename}</td>
                    <td>{submit.result}</td>
                    <td>
                      <button className="my-1 px-3 py-2 rounded-md bg-purple-500 hover:bg-purple-600 text-white">
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
    result: '4',
  },
  {
    id: 2,
    date: '2022-02-24 05:28',
    filename: 'test2.go',
    result: '18',
  },
  {
    id: 3,
    date: '2022-02-24 06:03',
    filename: 'test3.go',
    result: '33',
  },
];
