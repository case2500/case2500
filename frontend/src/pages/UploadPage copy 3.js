import React, { useState, useEffect } from 'react';

import { Col, Row, Container } from "react-bootstrap";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import './App.css';
import FileUploadScreen from './screens/FileUploadScreen.js';
import { getSingleFiles, getMultipleFiles } from './data/api';


const SUPPORTED_IMAGE_FORMATS = ["image/jpg", "image/jpeg"];

const UploadPage = () => {
  const history = useHistory();
  const { addToast } = useToasts();

  const { handleSubmit, errors, register } = useForm();
  const [singleFiles, setSingleFiles] = useState([]);
  const [multipleFiles, setMultipleFiles] = useState([]);
  const [main, setMain] = useState(1)

  const getSingleFileslist = async () => {
    try {
      const fileslist = await getSingleFiles();
      setSingleFiles(fileslist);
      //alert(JSON.stringify(fileslist))
    } catch (error) {
      console.log(error);
    }
  }
  const getMultipleFilesList = async () => {
    try {
      const fileslist = await getMultipleFiles();
      setMultipleFiles(fileslist);
      // console.log(multipleFiles);
      // const test = Object.values(multipleFiles);
   // alert(JSON.stringify(multipleFiles))
    } catch (error) {
      console.log(error);
    }
  }




  useEffect(() => {
   // getSingleFileslist();
    getMultipleFilesList();
  }, []);
  return (
    <>
      <div className="container">
        <h3 className="text-danger font-weight-bolder border-bottom text-center">Single & Multiple File Upload Using MERN Stack </h3>
       {/* // <FileUploadScreen getsingle={() => getSingleFileslist()} getMultiple={() => getMultipleFilesList()} /> */}
        <FileUploadScreen  getMultiple={() => getMultipleFilesList()} />
      </div>
   
      <div className="container-fluid mt-5">
        <div className="row">
        <div className="col-3"></div>

          <div className="col-6">
            <h4 className="text-success font-weight-bold">Multiple Files List</h4>

            {/* {JSON.stringify(multipleFiles)} */}
            {multipleFiles && multipleFiles.map((element, index) =>
              <div key={element._id}>
                <h6 className="text-danger font-weight-bold">{element.title}</h6>
                <div className="row">
                  {element.files.map((file, index) =>
                    <div >
                      <div className="card mb-2 border-0 p-0">
                      {index === main  ?      <img src={`http://localhost:8080/${file.filePath}`} height="150"  className="card-img-top img-responsive" alt="img" />:null}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
<hr></hr>
            {/* <img src={`http://localhost:8080/${main}`} alt='main' className='main' /> */}
            {multipleFiles.map((element, index) =>
              <div key={element._id}>
                <h6 className="text-danger font-weight-bold">{element.title}</h6>
                <div className="row">
                  {element.files.map((file, index) =>
                    <div className="col-2">
                       {/* {index === main  ?      <img src={`http://localhost:8080/${file.filePath}`} height="150"  className="card-img-top img-responsive" alt="img" />:null} */}
                      <div className="card mb-2 border-0 p-0">
                        <img src={`http://localhost:8080/${file.filePath}`} onClick={()=>setMain(index)} height="150" className="card-img-top img-responsive" alt="img" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default UploadPage;
