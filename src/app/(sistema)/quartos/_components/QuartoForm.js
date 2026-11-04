"use client";

import styles from "../novo/novo.module.css";

export default function QuartoForm({
  form,
  setForm,
  tipos,
  andares,
  blocos,
  capacidades,
  statusOpcoes,
  comodidadesOpcoes,
  atualizar,
  alternarComodidade,
  formatarMoeda,
  localizacao,
  formularioVazio,
  icons,
  onSubmit,
  mostrarStatus = true,
}) {
  return (
     <form className={styles.content} onSubmit={onSubmit}>
        <div className={styles.formColumn}>
          {/* IDENTIFICAÇÃO */}
          <section className={styles.card}>
            <h2 className={styles.cardTitle}>
              <span className={styles.cardIcon}>{icons.building}</span>
              Identificação do Quarto
            </h2>
 
            <div className={styles.grid}>
              <div className={styles.field}>
                <label htmlFor="numero">
                  Número do Quarto <span>*</span>
                </label>
                <input
                  id="numero"
                  type="text"
                  inputMode="numeric"
                  placeholder="Ex: 105"
                  value={form.numero}
                  onChange={atualizar("numero")}
                  required
                />
              </div>
 
              <div className={styles.field}>
                <label htmlFor="tipo">
                  Tipo de Quarto <span>*</span>
                </label>
                <div className={styles.selectBox}>
                  <select id="tipo" value={form.tipo} onChange={atualizar("tipo")} required>
                    <option value="">Selecione</option>
                    {tipos.map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                  <span className={styles.selectIcon}>{icons.chevronDown}</span>
                </div>
              </div>
 
              <div className={styles.field}>
                <label htmlFor="andar">Andar</label>
                <div className={styles.selectBox}>
                  <select id="andar" value={form.andar} onChange={atualizar("andar")}>
                    <option value="">Selecione</option>
                    {andares.map((a) => (
                      <option key={a}>{a}</option>
                    ))}
                  </select>
                  <span className={styles.selectIcon}>{icons.chevronDown}</span>
                </div>
              </div>
 
              <div className={styles.field}>
                <label htmlFor="bloco">Bloco / Ala</label>
                <div className={styles.selectBox}>
                  <select id="bloco" value={form.bloco} onChange={atualizar("bloco")}>
                    <option value="">Selecione</option>
                    {blocos.map((b) => (
                      <option key={b}>{b}</option>
                    ))}
                  </select>
                  <span className={styles.selectIcon}>{icons.chevronDown}</span>
                </div>
              </div>
            </div>
          </section>
 
          {/* CAPACIDADE E TARIFAS */}
          <section className={styles.card}>
            <h2 className={styles.cardTitle}>
              <span className={styles.cardIcon}>{icons.users}</span>
              Capacidade e Tarifas
            </h2>
 
            <div className={styles.grid}>
              <div className={styles.field}>
                <label htmlFor="capacidade">
                  Capacidade Máxima <span>*</span>
                </label>
                <div className={styles.selectBox}>
                  <select
                    id="capacidade"
                    value={form.capacidade}
                    onChange={atualizar("capacidade")}
                    required
                  >
                    <option value="">Selecione</option>
                    {capacidades.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                  <span className={styles.selectIcon}>{icons.chevronDown}</span>
                </div>
              </div>
 
              <div className={styles.field}>
                <label htmlFor="diaria">
                  Valor da Diária (Base) <span>*</span>
                </label>
                <input
                  id="diaria"
                  type="text"
                  inputMode="numeric"
                  placeholder="R$ 0,00"
                  value={form.diaria}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      diaria: e.target.value.replace(/\D/g, "") ? formatarMoeda(e.target.value) : "",
                    }))
                  }
                  required
                />
              </div>
            </div>
 
            {mostrarStatus && (
      <div className={styles.statusField}>
            <span className={styles.label}>
            Status Inicial <span>*</span>
           </span>

            <div className={styles.statusGroup}>
          {statusOpcoes.map((s) => {
            const ativo = form.status === s;

           return (
                <button
            key={s}
            type="button"
            className={`${styles.statusButton} ${
              ativo ? styles.statusActive : ""
            }`}
            aria-pressed={ativo}
            onClick={() =>
              setForm((f) => ({
                ...f,
                status: s,
              }))
            }
          >
            {ativo && icons.checkCircle}
            {s}
          </button>
           );
               })}
         </div>
          </div>
            )}
          </section>
 
          {/* COMODIDADES */}
          <section className={styles.card}>
            <h2 className={styles.cardTitle}>
              <span className={styles.cardIcon}>{icons.star}</span>
              Comodidades e Recursos
            </h2>
 
            <div className={styles.amenities}>
              {comodidadesOpcoes.map((item) => {
                const marcado = form.comodidades.includes(item);
                return (
                  <button
                    key={item}
                    type="button"
                    role="checkbox"
                    aria-checked={marcado}
                    className={`${styles.amenity} ${marcado ? styles.amenityOn : ""}`}
                    onClick={() => alternarComodidade(item)}
                  >
                    <span className={styles.amenityCheck}>{marcado && icons.check}</span>
                    {item}
                  </button>
                );
              })}
            </div>
          </section>
        </div>
 
        {/* RESUMO */}
        <aside className={styles.summary}>
          <h2 className={styles.summaryTitle}>Resumo do Registro</h2>
 
          <dl className={styles.summaryList}>
            <div>
              <dt>Identificação:</dt>
              <dd>{form.numero ? `Quarto ${form.numero}` : "—"}</dd>
            </div>
            <div>
              <dt>Categoria:</dt>
              <dd>{form.tipo || "—"}</dd>
            </div>
            <div>
              <dt>Localização:</dt>
              <dd>{localizacao}</dd>
            </div>
            <div>
              <dt>Valor da Diária:</dt>
              <dd className={styles.summaryPrice}>{form.diaria || "—"}</dd>
            </div>
          </dl>
 
          <button type="submit" className={styles.confirmButton}>
            Confirmar Cadastro
          </button>
          <button
            type="button"
            className={styles.clearButton}
            onClick={() => setForm(formularioVazio)}
          >
            Limpar Formulário
          </button>
        </aside>
      </form>
  );
}