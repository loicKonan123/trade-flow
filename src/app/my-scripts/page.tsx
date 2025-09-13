// src/app/my-scripts/page.tsx
export default function MyScripts() {
  return (
    <div className="max-w-3xl mx-auto py-12">
      <h2 className="text-2xl font-bold mb-6">Mes scripts</h2>
      <p>Vous pouvez télécharger ici tous les scripts que vous avez achetés.</p>
      {/* Ici, tu peux afficher la liste des achats depuis Firestore */}
    </div>
  );
}