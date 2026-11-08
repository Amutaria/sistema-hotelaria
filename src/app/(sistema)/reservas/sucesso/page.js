"use client";

import { useState } from "react";

export default function ReservaSucesso() {

  const [reserva] = useState(() => {

    if (typeof window === "undefined") {
      return {};
    }

    const dados = sessionStorage.getItem("reservaAtual");

    return dados ? JSON.parse(dados) : {};
  });

  const [codigo] = useState(() => {

    if (typeof window === "undefined") {
      return "";
    }

    let codigoSalvo =
      sessionStorage.getItem("codigoReserva");

    if (!codigoSalvo) {

      codigoSalvo =
        "HP-" +
        Math.floor(1000 + Math.random() * 9000) +
        "-" +
        new Date().getFullYear();

      sessionStorage.setItem(
        "codigoReserva",
        codigoSalvo
      );
    }

    return codigoSalvo;
  });

  return (
    <main style={{
      minHeight: "100vh",
      background: "#f5f7fa",
      padding: "50px",
      textAlign: "center"
    }}>

      <div style={{
        maxWidth: "700px",
        margin: "0 auto",
        background: "#ffffff",
        padding: "40px",
        borderRadius: "10px",
        border: "1px solid #e2e6e9"
      }}>

        <div style={{
          fontSize: "55px"
        }}>
          ✅
        </div>

        <h1>
          Reserva realizada com sucesso!
        </h1>

        <p>
          A reserva foi processada e confirmada no sistema.
        </p>

        <div style={{
          margin: "30px auto",
          padding: "20px",
          maxWidth: "250px",
          background: "#f5f9fb",
          borderRadius: "8px"
        }}>

          <small>
            CÓDIGO DA RESERVA
          </small>

          <h2 style={{
            color: "#079fe8"
          }}>
            {codigo}
          </h2>

        </div>

        <div style={{
          textAlign: "left",
          borderTop: "1px solid #e5e8eb",
          paddingTop: "20px"
        }}>

          <h2>Resumo da Estadia</h2>

          <p>
            <strong>Hóspede:</strong>{" "}
            {reserva.hospede?.nome}
          </p>

          <p>
            <strong>CPF:</strong>{" "}
            {reserva.hospede?.cpf}
          </p>

          <p>
            <strong>Acomodação:</strong>{" "}
            Quarto #{reserva.quarto?.numero} —
            {" "}{reserva.quarto?.categoria}
          </p>

          <p>
            <strong>Check-in:</strong>{" "}
            {reserva.checkIn}
          </p>

          <p>
            <strong>Check-out:</strong>{" "}
            {reserva.checkOut}
          </p>

          <p>
            <strong>Adultos:</strong>{" "}
            {reserva.adultos}
          </p>

          <p>
            <strong>Crianças:</strong>{" "}
            {reserva.criancas}
          </p>

          <h2 style={{
            color: "#079fe8",
            marginTop: "25px"
          }}>
            Valor Total: R${" "}
            {Number(
              reserva.financeiro?.total || 0
            ).toFixed(2)}
          </h2>

        </div>

      </div>

    </main>
  );
}