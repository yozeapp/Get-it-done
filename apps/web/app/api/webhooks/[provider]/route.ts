export async function POST(_: Request, { params }: { params: { provider: string }}) {
  // TODO: verify signatures per provider; update DeliveryLog or opt-outs
  return new Response('ok');
}
