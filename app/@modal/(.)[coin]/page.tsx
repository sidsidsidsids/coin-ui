type CoinModalParams = Promise<{
  coin: string;
}>;
type RawDataItem = {
  id: number;
  korean_name: string;
  name_code: string;
  candle_date: string;
  trade_price: number;
  change_price: number | null;
  ma_7: number | null;
  ma_14: number | null;
  ma_50: number | null;
  rsi: number | null;
  score: number;
};
type RawData = RawDataItem[];

import Modal from "@/components/modal";
import Chart from "@/components/chart";
import Dialog from "@/components/dialog";
import { roundTo } from "@/util/mathfunc";

async function fetchCoin(coin: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URI}/${coin}`, {
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

async function calculateForecast(data: RawData) {
  const size = data.length;
  let shortTermForecast = 0;
  let shortTermCount = 0;
  let mediumTermForecast = 0;
  let mediumTermCount = 0;
  let longTermForecast = 0;
  let longTermCount = 0;

  // 배열을 순회하며 예측값 계산
  for (let i = 0; i < size - 1; i++) {
    const currentItem = data[i];
    const currentPrice = currentItem.trade_price;

    // 단기 예측 (다음 인덱스와 비교)
    if (i + 1 < size) {
      const nextItem = data[i + 1];
      const nextPrice = nextItem.trade_price;
      const nextScore = nextItem.score;

      if (currentPrice > nextPrice) {
        if (nextScore >= 1) shortTermForecast++; // 예측값 증가
        if (Math.abs(nextScore) >= 1) shortTermCount++; // 예측횟수 증가
      } else if (currentPrice < nextPrice) {
        if (nextScore <= -1) shortTermForecast++; // 예측값 증가
        if (Math.abs(nextScore) >= 1) shortTermCount++; // 예측횟수 증가
      }
    }

    // 중기 예측 (14번째 후 인덱스와 비교)
    if (i + 14 < size) {
      const mediumTermItem = data[i + 14];
      const mediumTermPrice = mediumTermItem.trade_price;
      const mediumTermScore = mediumTermItem.score;

      if (currentPrice > mediumTermPrice) {
        if (mediumTermScore >= 1) mediumTermForecast++; // 예측값 증가
        if (Math.abs(mediumTermScore) >= 1) mediumTermCount++; // 예측횟수 증가
      } else if (currentPrice < mediumTermPrice) {
        if (mediumTermScore <= -1) mediumTermForecast++; // 예측값 증가
        if (Math.abs(mediumTermScore) >= 1) mediumTermCount++; // 예측횟수 증가
      }
    }

    // 장기 예측 (50번째 후 인덱스와 비교)
    if (i + 50 < size) {
      const longTermItem = data[i + 50];
      const longTermPrice = longTermItem.trade_price;
      const longTermScore = longTermItem.score;

      if (currentPrice > longTermPrice) {
        if (longTermScore >= 1) longTermForecast++; // 예측값 증가
        if (Math.abs(longTermScore) >= 1) longTermCount++; // 예측횟수 증가
      } else if (currentPrice < longTermPrice) {
        if (longTermScore <= -1) longTermForecast++; // 예측값 증가
        if (Math.abs(longTermScore) >= 1) longTermCount++; // 예측횟수 증가
      }
    }
  }

  const shortTermAccuracy = shortTermCount
    ? roundTo((shortTermForecast / shortTermCount) * 100, 2)
    : "-";
  const mediumTermAccuracy = mediumTermCount
    ? roundTo((mediumTermForecast / mediumTermCount) * 100, 2)
    : "-";
  const longTermAccuracy = longTermCount
    ? roundTo((longTermForecast / longTermCount) * 100, 2)
    : "-";
  let recommendation = "관망";
  if (data[0].score >= 1) {
    recommendation = "매수";
  } else if (data[0].score <= -1) {
    recommendation = "매도";
  }
  return {
    shortTermAccuracy,
    mediumTermAccuracy,
    longTermAccuracy,
    recommendation,
  };
}

export default async function CoinModal({
  params,
}: {
  params: CoinModalParams;
}) {
  const { coin } = await params;
  const data = await fetchCoin(coin);
  const forecast = await calculateForecast(data);
  return (
    <>
      <div className="hidden md:block">
        <Modal>
          <Chart data={data.reverse()} name_code={coin} forecast={forecast} />
        </Modal>
      </div>
      <div className="block md:hidden">
        <Dialog>
          <p className="text-lg font-extrabold">{coin}/KRW</p>
          <p>
            <span className="font-extrabold">
              기술지표 기반 추천 : {forecast.recommendation}
            </span>
          </p>
          <p className="text-md mt-2 font-normal">
            최근(최대 100일) 추천 정확도
          </p>
          <div className="pt-1.5 font-normal">
            <p>단기(1일) : {forecast.shortTermAccuracy}%</p>
            <p>중기(14일) : {forecast.mediumTermAccuracy}%</p>
            <p>장기(50일) : {forecast.longTermAccuracy}%</p>
          </div>
          <p className="text-md mt-2 font-normal text-gray-600">
            (데스크탑에서 차트 확인 가능)
          </p>
        </Dialog>
      </div>
    </>
  );
}
