import React, { useEffect, useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import SearchBar from "./components/SearchBar.jsx";
import FilterBar from "./components/FilterBar.jsx";
import ProfileCard from "./components/ProfileCard.jsx";
import ProfileModal from "./components/ProfileModal.jsx";
import Profiles from "./pages/Profiles.jsx";
import "./App.css";

function MainContent({
  dark,
  setDark,
  query,
  setQuery,
  filters,
  setFilters,
  selected,
  setSelected,
  profiles,
}) {
  return (
    <div className="min-h-screen token-bg token-text">
      <Navbar dark={dark} setDark={setDark} />

      <main className="mx-auto max-w-7xl px-4 pb-20 pt-8">
        {/* Cabeçalho */}
        <section className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Descubra profissionais e talentos
            </h1>
            <p className="token-muted mt-1 text-sm">
              Explore perfis, filtre por área e conecte-se para oportunidades.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/profiles/preview" className="btn btn-secondary">
              Ver página de perfil
            </Link>
          </div>
        </section>

        {/* Busca e filtros */}
        <section className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-4">
          <div className="md:col-span-2">
            <SearchBar
              value={query}
              onChange={setQuery}
              onSubmit={() => {}}
            />
          </div>
          <div className="md:col-span-2">
            <FilterBar filters={filters} onChange={setFilters} />
          </div>
        </section>

        {/* Lista de perfis */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {profiles.length === 0 ? (
            <p>Nenhum perfil encontrado.</p>
          ) : (
            profiles.map((p) => (
              <ProfileCard
                key={p.id}
                name={p.nome}
                role={`${p.area} • ${p.senioridade}`}
                avatar={p.avatar}
                skills={[p.area, p.senioridade]}
                onClick={() => setSelected(p)}
              />
            ))
          )}
        </section>
      </main>

      {/* Modal do perfil */}
      <ProfileModal
        open={!!selected}
        onClose={() => setSelected(null)}
        profile={selected}
      />
    </div>
  );
}

export default function App() {
  const [dark, setDark] = useState(false);
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState({ area: "", seniority: "" });
  const [selected, setSelected] = useState(null);
  const [profiles, setProfiles] = useState([]);

  // Alternância modo escuro
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  // Busca automática com filtros e busca de nome
  useEffect(() => {
    const params = new URLSearchParams();
    if (query) params.append("nome", query);
    if (filters.area) params.append("area", filters.area);
    if (filters.seniority) params.append("senioridade", filters.seniority);

    fetch(`http://localhost:5000/api/search?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => setProfiles(data))
      .catch((err) => console.error("Erro ao buscar perfis:", err));
  }, [query, filters]); // 👈 Atualiza quando muda busca ou filtro

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <MainContent
              dark={dark}
              setDark={setDark}
              query={query}
              setQuery={setQuery}
              filters={filters}
              setFilters={setFilters}
              selected={selected}
              setSelected={setSelected}
              profiles={profiles}
            />
          }
        />
        <Route path="/profiles/:id" element={<Profiles />} />
        <Route path="/profiles/preview" element={<Profiles preview />} />
      </Routes>
    </>
  );
}
