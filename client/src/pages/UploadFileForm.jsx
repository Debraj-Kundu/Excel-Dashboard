import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DescriptionIcon from "@mui/icons-material/Description";

const URL = `${process.env.REACT_APP_SERVER_URL}/spreadsheet`;
const validMimeTypes = [
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "text/csv",
];

const UploadFileForm = () => {
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  // console.log(file);
  const handleChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (file === null) return;
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await axios({
        method: "post",
        url: URL,
        data: formData,
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(res.data);
      navigate("/");
      toast.success("File uploaded successfully!");
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong. Please try again.");
    }
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="mt-8 ml-40 mr-40 p-5 flex flex-col gap-4 align-center justify-center border border-gray-500 border-dashed rounded-lg"
    >
      {!file && (
        <div>
          <label
            htmlFor="file"
            className="flex justify-center hover:opacity-75 hover:scale-105 cursor-pointer transition-transform duration-200"
          >
            <img
              loading="lazy"
              height="500px"
              width="500px"
              src={`${process.env.PUBLIC_URL}/FileUpload.svg`}
              alt="File Upload"
            />
          </label>
        </div>
      )}
      {file && (
        <div className="flex justify-center">
          <img
            loading="lazy"
            height="500px"
            width="500px"
            src={`${process.env.PUBLIC_URL}/ReadyToUpload.svg`}
            alt="Ready to Upload"
          />
        </div>
      )}
      <input
        className="hidden"
        type="file"
        id="file"
        accept={validMimeTypes}
        onChange={handleChange}
      />
      {file && (
        <div className="flex justify-center items-center text-sm text-gray-600">
          <DescriptionIcon fontSize="large" className="mr-2 text-gray-500" />
          <p>
            <b>{file.name}</b> is ready to upload!
          </p>
        </div>
      )}
      <div className="flex justify-center">
        <button
          className="rounded-md bg-emerald-400 px-2 py-2 text-sm font-medium text-white shadow"
          type="submit"
        >
          <CloudUploadIcon /> Upload
        </button>
      </div>
    </form>
  );
};

export default UploadFileForm;
