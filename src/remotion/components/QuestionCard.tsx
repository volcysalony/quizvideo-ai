import React from "react";

import {
  staticFile,
} from "remotion";

type Props = {
  question: string;
  image?: string;
};

export const QuestionCard: React.FC<Props> = ({
  question,
  image,
}) => {
  const imageSrc =
    image
      ? staticFile(
          image.replace(
            /^\//,
            ""
          )
        )
      : null;

  return (
    <div
      style={{
        width: "100%",
        minHeight: 620,

        backgroundColor: "#FFFFFF",

        border:
          "5px solid #111111",

        borderRadius: 44,

        boxShadow:
          "0 16px 0 rgba(0,0,0,0.20)",

        padding:
          "48px 44px 42px",

        boxSizing:
          "border-box",

        display: "flex",

        flexDirection:
          "column",

        alignItems:
          "center",

        fontFamily:
          "Arial, Helvetica, sans-serif",
      }}
    >
      {/* PERGUNTA */}

      <div
        style={{
          width: "100%",

          fontSize: 66,

          fontWeight: 900,

          lineHeight: 1.06,

          textAlign:
            "center",

          letterSpacing:
            "-1.5px",

          color:
            "#111111",

          textTransform:
            "uppercase",
        }}
      >
        {question}
      </div>

      {/* ÁREA DA IMAGEM */}

      <div
        style={{
          width: "82%",

          height: 330,

          marginTop: 38,

          borderRadius: 34,

          overflow:
            "hidden",

          display: "flex",

          alignItems:
            "center",

          justifyContent:
            "center",

          position:
            "relative",
        }}
      >
        {imageSrc ? (
          <img
            src={imageSrc}
            alt=""
            style={{
              width:
                "100%",

              height:
                "100%",

              objectFit:
                "contain",
            }}
          />
        ) : (
          <div
            style={{
              width:
                "100%",

              height:
                "100%",

              borderRadius:
                30,

              background:
                "linear-gradient(135deg, #F8FAFC 0%, #E5E7EB 100%)",

              display:
                "flex",

              alignItems:
                "center",

              justifyContent:
                "center",

              color:
                "#6B7280",

              fontSize:
                34,

              fontWeight:
                800,
            }}
          >
            IMAGEM
          </div>
        )}
      </div>
    </div>
  );
};