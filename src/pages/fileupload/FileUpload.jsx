import { Button } from "@mui/material";
import React, { useState } from "react";
import FileUploader from "react-mui-fileuploader";
import axios from "axios";
import Bike from "../../assets/Bike.png";
import { useTranslation } from "react-i18next";

function FileUpload() {
  const { t, i18n } = useTranslation("translation");
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
        title={t("fileupload.title")}
        multiFile={false}
        onFilesChange={fHandeFileChange}
        allowedExtensions={["xml"]}
        header={t("fileupload.header")}
        leftLabel={t("fileupload.labelRight")}
        rightLabel={t("fileupload.labelLeft")}
        buttonLabel={t("fileupload.buttonLabel")}
        imageSrc={Bike}
        imageSrcAlt={t("fileupload.imageAlt")}
      />
      <Button variant="contained" onClick={fUploadFile}>
        {t("fileupload.uploadButton")}
      </Button>
    </>
  );
}

export default FileUpload;
