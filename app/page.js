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

  function getRowColor(score) {
    switch (score) {
      case 3:
        return "bg-red-400";
      case 2:
        return "bg-red-200";
      case 1:
        return "bg-red-50";
      case 0:
        return "bg-white";
      case -1:
        return "bg-blue-50";
      case -2:
        return "bg-blue-200";
      case -3:
        return "bg-blue-400";
      default:
        return "bg-white";
    }
  }
  return (
    <div className="bg-slate-700 grid items-center min-h-screen gap-16 sm:p-2 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col items-center gap-4 row-start-2 items-start">
        <section className="mb-14 w-full max-w-[1016px] text-psbk dark:text-dark-psbk desktop:w-full desktop:min-w-[1016px]">
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left rtl:text-right text-gray-900 dark:text-gray-400">
              <caption className="p-5 text-xl font-semibold text-left rtl:text-right text-gray-900 bg-white dark:text-white dark:bg-gray-800">
                기술 지표 기반 코인 종목 추천
                <p className="mt-1 text-sm font-normal text-gray-600 dark:text-gray-400">
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
                <p className="mt-1 text-sm font-normal text-gray-600 dark:text-gray-400">
                  하루 전날({data ? data[0].candle_date : "데이터 없음"})까지의
                  데이터를 기반으로 지표를 계산하며, 한국 시간 기준 매일 오전
                  0시 이후에 데이터를 갱신합니다.
                </p>
                <p className="mt-1 text-sm font-normal text-gray-400 dark:text-gray-400">
                  이동평균선(MA): 일정 기간 동안의 평균 가격을 의미하며 가격
                  변동과 추세를 파악하기 위한 지표입니다.
                </p>
                <p className="mt-1 text-sm font-normal text-gray-400 dark:text-gray-400">
                  RSI: 일정 기간 동안의 상승폭과 하락폭을 비교하는 지표이며
                  일반적으로 70 이상은 과매수, 30 이하는 과매도로 간주합니다.
                </p>
              </caption>
              <thead className="text-xs text-gray-800 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    종목 (마켓)
                  </th>
                  <th scope="col" className="px-6 py-3">
                    전날 종가
                  </th>
                  <th scope="col" className="px-6 py-3">
                    전날 변동가
                  </th>
                  <th scope="col" className="px-6 py-3">
                    MA_7
                  </th>
                  <th scope="col" className="px-6 py-3">
                    MA_14
                  </th>
                  <th scope="col" className="px-6 py-3">
                    MA_50
                  </th>
                  <th scope="col" className="px-6 py-3">
                    RSI_14
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.map((coin, index) => (
                  <tr
                    key={coin.name_code}
                    className={`${getRowColor(
                      coin.score
                    )} border-b dark:border-gray-700`}
                  >
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      <span>
                        {coin.korean_name} ({coin.name_code}/KRW)
                      </span>
                    </th>
                    <td className="px-6 py-4">
                      {coin.trade_price > 100
                        ? Number(coin.trade_price).toLocaleString("ko-KR")
                        : coin.trade_price}
                    </td>
                    <td className="px-6 py-4">
                      {coin.change_price
                        ? coin.change_price > 100
                          ? Number(coin.change_price).toLocaleString("ko-KR")
                          : coin.change_price
                        : 0}
                    </td>
                    <td className="px-6 py-4">
                      {coin.ma_7
                        ? coin.ma_7 > 100
                          ? Math.round(coin.ma_7, 2).toLocaleString("ko-KR")
                          : coin.ma_7
                        : "-"}
                    </td>
                    <td className="px-6 py-4">
                      {coin.ma_14
                        ? coin.ma_14 > 100
                          ? Math.round(coin.ma_14, 2).toLocaleString("ko-KR")
                          : coin.ma_14
                        : "-"}
                    </td>
                    <td className="px-6 py-4">
                      {coin.ma_50
                        ? coin.ma_50 > 100
                          ? Math.round(coin.ma_50, 2).toLocaleString("ko-KR")
                          : coin.ma_50
                        : "-"}
                    </td>
                    <td className="px-6 py-4">{coin.rsi ? coin.rsi : "-"}</td>
                  </tr>
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
