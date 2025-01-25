import TableRow from "@/components/tableRow";

async function fetchData() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URI}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "default",
  });
  if (!res.ok) {
    throw new Error(res.statusText);
  }
  const json = await res.json();
  return json;
}
export const dynamic = "force-dynamic";
export default async function Home() {
  const data = await fetchData();

  return (
    <div className="bg-slate-900 overflow-x-auto grid items-center min-h-screen gap-16 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col items-center gap-4 row-start-2 items-start">
        <section className="mb-6 md:mb-14 w-full max-w-[1016px] desktop:w-full">
          <div className="relative overflow-x-auto sm:rounded-lg">
            <table className="w-full text-xs md:text-sm text-left rtl:text-right text-gray-900">
              <caption className="p-3 md:p-5 text-lg md:text-xl font-semibold text-left rtl:text-right text-gray-900 bg-white">
                기술 지표 기반 코인 종목 추천
                <p className="mt-1 text-xs md:text-sm font-normal text-gray-700 transition-color hover:text-gray-800">
                  <a href="https://upbit.com/home" className="underline">
                    업비트
                  </a>{" "}
                  내에서 조회 가능한 코인들의 데이터를 수집하여 이동평균선(MA),
                  RSI와 같은 기술 지표들을 계산하여 이를 기반으로 매수 및 매도
                  판단을 시각화한 웹 UI입니다. 테이블 내에서 코인 종목이
                  <span className="text-red-600"> 붉을수록 </span>
                  매수를 추천하는 종목이며
                  <span className="text-blue-600"> 푸를수록 </span>
                  매도를 추천하는 종목입니다.
                </p>
                <p className="mt-1 text-xs font-normal text-gray-700 md:text-sm transition-color hover:text-gray-800">
                  현재 최신 데이터는 {data
                    ? `${data[0].candle_date} 오전 9시`
                    : "(현재 데이터가 없습니다) "}
                  부터 24시간 후 까지의 데이터입니다.
                </p>
                <p className="mt-1 text-xs md:text-sm font-normal text-gray-500 transition-color hover:text-gray-800">
                  이동평균선(MA): 일정 기간 동안의 평균 가격을 의미하며 가격
                  변동과 추세를 파악하기 위한 지표입니다.
                </p>
                <p className="mt-1 text-xs md:text-sm font-normal text-gray-500 transition-color hover:text-gray-800">
                  RSI: 일정 기간 동안의 상승폭과 하락폭을 비교하는 지표이며
                  일반적으로 70 이상은 과매수, 30 이하는 과매도로 간주합니다.
                </p>
              </caption>
              <thead className="text-xs text-gray-800 uppercase bg-gray-50">
                <tr>
                  <th scope="col" className="px-2 md:px-6 py-2 md:py-3">
                    종목 (마켓)
                  </th>
                  <th scope="col" className="px-2 md:px-6 py-2 md:py-3">
                    전날 종가
                  </th>
                  <th scope="col" className="px-2 md:px-6 py-2 md:py-3">
                    전날 변동가
                  </th>
                  <th scope="col" className="px-6 py-3 hidden md:table-cell">
                    MA_7
                  </th>
                  <th scope="col" className="px-6 py-3 hidden md:table-cell">
                    MA_14
                  </th>
                  <th scope="col" className="px-6 py-3 hidden md:table-cell">
                    MA_50
                  </th>
                  <th scope="col" className="px-6 py-3 hidden md:table-cell">
                    RSI_14
                  </th>
                </tr>
              </thead>
              <tbody className="">
                {data.map((coin, index) => (
                  <TableRow key={coin.name_code} coin={coin} />
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center"></footer>
    </div>
  );
}
