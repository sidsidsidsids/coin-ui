"use client";
type DataItem = {
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

import { useRouter } from "next/navigation";
import { roundTo } from "@/util/mathfunc";

export default function TableRow({ coin }: { coin: DataItem }) {
  const router = useRouter();
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
    <tr
      className={`${getRowColor(
        coin.score
      )} border-b transition-colors duration-200 ease-in-out hover:bg-slate-700 hover:text-white cursor-pointer`}
      onClick={() => {router.push(`/${coin.name_code}`, { scroll: false })}}
    >
      <th
        scope="row"
        className="px-2 md:px-6 py-1 md:py-3 font-medium whitespace-nowrap"
      >
        <span>
          {coin.korean_name} ({coin.name_code}/KRW)
        </span>
      </th>
      <td className="px-2 md:px-6 py-1.5 md:py-3">
        {coin.trade_price > 100
          ? Number(coin.trade_price).toLocaleString("ko-KR")
          : coin.trade_price}
      </td>
      <td className="px-2 md:px-6 py-1.5 md:py-3">
        {coin.change_price
          ? Math.abs(coin.change_price) > 100
            ? roundTo(coin.change_price, 2).toLocaleString("ko-KR")
            : coin.change_price
          : 0}
      </td>
      <td className="px-6 py-4 hidden md:table-cell">
        {coin.ma_7
          ? coin.ma_7 > 100
            ? roundTo(coin.ma_7, 0).toLocaleString("ko-KR")
            : coin.ma_7
          : "-"}
      </td>
      <td className="px-6 py-4 hidden md:table-cell">
        {coin.ma_14
          ? coin.ma_14 > 100
            ? roundTo(coin.ma_14, 0).toLocaleString("ko-KR")
            : coin.ma_14
          : "-"}
      </td>
      <td className="px-6 py-4 hidden md:table-cell">
        {coin.ma_50
          ? coin.ma_50 > 100
            ? roundTo(coin.ma_50, 0).toLocaleString("ko-KR")
            : coin.ma_50
          : "-"}
      </td>
      <td className="px-6 py-4 hidden md:table-cell">
        {coin.rsi ? coin.rsi : "-"}
      </td>
    </tr>
  );
}
