import { useTranslation } from 'react-i18next';
import { useLoaderData } from 'react-router-dom';
import { z } from 'zod';
import { api, query } from '../api';
import { getRoundResponse, round } from '../api/game';
import { queryClient } from '../main';

export const loader = async ({ params }: { params: { id: string } }) => {
  return queryClient.fetchQuery({
    queryFn: () => api.round({ params }),
    queryKey: query.getKeyByAlias('round', { params }),
    staleTime: 1000,
  });
};

const submits = [
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

function Round() {
  const { t } = useTranslation();
  const { response_data } = useLoaderData() as z.infer<typeof getRoundResponse>;

  return (
    <div className="lg:w-full mx-3 mx-auto bg-white p-10 lg:rounded-3xl shadow-2xl">
      <h1 className="flex justify-center text-3xl">{t('Round')}: {response_data?.name}</h1>
      <h3 className="flex justify-center text-gray-500">{response_data?.description}</h3>
      <div className="flex flex-col w-full mt-5">
        <div className="flex flex-col lg:flex-row w-full">
          <div className="flex flex-col lg:w-1/2 h-full">
            <div className="p-5 mb-4 lg:rounded-xl shadow-sm bg-gray-100">
              <button
                className="mx-1 my-1 px-3 py-2 rounded-md transition-colors w-full bg-purple-500 hover:bg-purple-600 text-white"
              >{t('Download data')}</button>
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
              {submits.map(submit => (
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
