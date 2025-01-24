type CoinModalParams = Promise<{
  coin: string;
}>;

import Modal from "@/components/modal";
import Chart from "@/components/chart";

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

export default async function CoinModal({
  params,
}: {
  params: CoinModalParams;
}) {
  const { coin } = await params;
  const data = await fetchCoin(coin);
  return (
    <Modal>
      <Chart data={data.reverse()} name_code={coin} />
    </Modal>
  );
}
