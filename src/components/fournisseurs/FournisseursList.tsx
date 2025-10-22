import React from 'react';

const FournisseursList = ({ items }: { items: any[] }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Email</th>
            <th>Téléphone</th>
          </tr>
        </thead>
        <tbody>
          {items.map((f) => (
            <tr key={f.id} className="border-t">
              <td className="p-2">{f.full_name}</td>
              <td className="p-2">{f.email}</td>
              <td className="p-2">{f.phone}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FournisseursList;
