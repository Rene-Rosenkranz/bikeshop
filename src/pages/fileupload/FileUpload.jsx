import { Button } from "@mui/material";
import React, { useState } from "react";
import FileUploader from "react-mui-fileuploader";
import axios from "axios";
import Bike from "../../assets/Bike.png";

function FileUpload() {
  const [oFileToUpload, fSetFileToUpload] = useState();
  const fHandeFileChange = (file) => {
    fSetFileToUpload(file);
  };
  const fUploadFile = () => {
    let formData = new FormData();
    formData.append("files", oFileToUpload);
    const sJSONFile = JSON.stringify(oFileToUpload);

    axios.post(
      "/URL",
      {
        file: sJSONFile,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  };

  return (
    <>
      <FileUploader
        title="Upload files here"
        multiFile={false}
        onFilesChange={fHandeFileChange}
        allowedExtensions={["xml"]}
        header="Simulation über XML Datei"
        leftLabel=""
        rightLabel=""
        buttonLabel="Datei auswählen"
        imageSrc={Bike}
        imageSrcAlt="lol das bild ist weg"
      />
      <Button variant="contained" onClick={fUploadFile}>
        Datei hochladen
      </Button>
    </>
  );
}

export default FileUpload;
