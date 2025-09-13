// src/app/checkout/page.tsx
export default function Checkout() {
  return (
    <div className="max-w-3xl mx-auto py-12 text-center">
      <h2 className="text-2xl font-bold mb-6">Paiement sécurisé</h2>
      <p className="mb-4">Vous allez acheter : RSI Divergence (19.99€)</p>
      <button className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700">
        Payer avec Stripe
      </button>
    </div>
  );
}