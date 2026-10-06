import satori from "satori";
import { readFileSync } from "node:fs";
import { SITE } from "@config";
import loadGoogleFonts, { type FontOptions } from "../loadGoogleFont";

const TITLE = "Sr. Software Engineer · Tech Lead · AWS Solutions Architect";

export default async () => {
  const photo = `data:image/jpeg;base64,${readFileSync("public/assets/joan.jpg").toString("base64")}`;

  return satori(
    <div
      style={{
        background: "#111116",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        padding: "0 90px",
        color: "#edecf0",
      }}
    >
      <img
        src={photo}
        width={320}
        height={320}
        style={{ borderRadius: "50%", border: "6px solid #a5b4fc" }}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          marginLeft: "70px",
          flex: 1,
        }}
      >
        <p style={{ fontSize: 80, fontWeight: "bold", margin: 0 }}>
          {SITE.author}
        </p>
        <p
          style={{
            fontSize: 34,
            color: "#aaaab8",
            margin: "16px 0 0 0",
            lineHeight: 1.3,
          }}
        >
          {TITLE}
        </p>
        <p style={{ fontSize: 28, color: "#a5b4fc", margin: "40px 0 0 0" }}>
          {new URL(SITE.website).hostname}
        </p>
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
      embedFont: true,
      fonts: (await loadGoogleFonts(
        SITE.author + TITLE + new URL(SITE.website).hostname
      )) as FontOptions[],
    }
  );
};
