import { useEffect, useState } from "react";
import ProfileCard from "../components/ProfileCard";
import ProfileModal from "../components/ProfileModal";

export default function Profiles() {
  const [profiles, setProfiles] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    // Busca os dados do backend
    fetch("http://localhost:5000/api/profiles")
      .then((res) => res.json())
      .then((data) => {
        console.log("Perfis recebidos:", data);
        setProfiles(data);
      })
      .catch((err) => console.error("Erro ao buscar perfis:", err));
  }, []);

  return (
    <main className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2 lg:grid-cols-3">
      {profiles.length === 0 ? (
        <p>Nenhum perfil encontrado.</p>
      ) : (
        profiles.map((profile) => (
          <ProfileCard
            key={profile.id}
            name={profile.nome}
            role={profile.area}
            avatar={profile.avatar}
            skills={[profile.area, profile.senioridade]}
            onClick={() => setSelected(profile)}
          />
        ))
      )}

      {/* Modal de perfil */}
      <ProfileModal
        open={!!selected}
        onClose={() => setSelected(null)}
        profile={selected}
      />
    </main>
  );
}
