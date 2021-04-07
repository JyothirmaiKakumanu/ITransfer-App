import React, { useState } from 'react';
import _ from 'lodash';
import classNames from 'classnames';
import {upload} from '../helpers/upload';

const HomeForm = () => {

    //creating the state
    const [toMail,setToMail] = useState('');
    const [fromMail,setFromMail] = useState('');
    const [message,setMessage] = useState('');
    const [files,setFiles] = useState([]);
    
    const [errors,setErrors]= useState({
        to: null,
        from: null,
        msg: null,
        files: null,
    });


    // Set Recipient mail address
    const tofieldTextChange=(event)=>{
        const fieldValue = event.target.value;
        setToMail(fieldValue);
    }


    //set your mail address
    const fromFieldTextChange=(event)=>{
        const fieldValue = event.target.value;
        setFromMail(fieldValue);
    }

    //set message box
    const messageTextChange=(event)=>{
       
        const fieldValue = event.target.value;
        setMessage(fieldValue);
    }

    
    const isEmail=(emailAddress)=>{
        const emailRegex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

        return emailRegex.test(emailAddress);
    }

    //form field validation 
    const formValidation =(fields=[],callback)=>{
        console.log("inside form validation",fromMail.length);
        let errorsCopied = {...errors};
        const validations ={
            from:[
                {
                    errorMessage: 'From is required',
                    isValid: ()=>{
                        return fromMail.length>0;
                    }
                },
                {
                    errorMessage: 'Email is not valid',
                    isValid: ()=>{
                        return isEmail(fromMail);
                    }
                }

            ],
            to:[
                {
                    errorMessage: 'To is required',
                    isValid: ()=>{
                        return toMail.length>0;
                    }
                },
                {
                    errorMessage: 'Email is not valid',
                    isValid: ()=>{
                        return isEmail(toMail);
                    }
                }

            ],
            files:[
                {
                    errorMessage: 'File is required',
                    isValid:()=>{
                        return files.length;
                    }
                }
            ]
             
        }

        _.each(fields,(field)=>{
            let fieldValidations = _.get(validations,field,[]); //it goes like validations[field] without lodash
            // console.log("line 89 field",field);
            errorsCopied[field] = null;
            // console.log("in line 91",errorsCopied);
            _.each(fieldValidations,(fieldValidation)=>{
                const isValid = fieldValidation.isValid();
                // console.log("line 94"+isValid);
                if(!isValid){
                    // console.log("in 96"+fieldValidation.errorMessage);
                    errorsCopied[field]= fieldValidation.errorMessage;
                }
            })
        }); 
        // console.log("check errors line 101");
        let isValid = true;
        _.each(errorsCopied,(err)=>{
            // console.log("in errors",errorsCopied);
            if(err!=null){
                isValid=false;
            }
        });
        console.log(errorsCopied);
        setErrors(errorsCopied);
        // if(isValid){
        //     console.log("The form is valid",isValid);
        // }
        // console.log(errors);
        return callback(isValid);
       
    }

    //submitting the form on click on send btn
    const onFormSubmit =(event)=>{
        event.preventDefault();
        // console.log("in form submit fun");
        formValidation(['from','to','files'],(isValid)=>{
            console.log("The form is ",isValid);
            if(isValid){
                //The form is vlaid and ready to submit
                upload(fromMail,toMail,message,files, (event)=>{

                    console.log("Upload callback of event ",event);
                })
            }

        });
    }


    const onAddingFiles=(event)=>{
        let filesAdded = [...files];
        // event.target.files;

        _.each(_.get(event, "target.files" ,[]), (file)=>{
            filesAdded.push(file);
        });
        console.log(filesAdded);
        setFiles(filesAdded);

        console.log("files",files);
    }

    const onFileRemove =(index)=>{
        // console.log("in file remove");
        let filesList = [...files];
        // console.log("line137"+filesList);
        filesList.splice(index,1);
        setFiles(filesList);

    }


    return (
        <div className="app-card">
            <form onSubmit={onFormSubmit}>
                <div className="app-card-header">
                    <div className= "app-card-header-inner">
                        {
                            files.length ? <div className="app-files-selected">
                                {
                                    files.map((file,index)=>{
                                        return (
                                            <div key={index} className="app-files-selected-item">
                                                    <div className="filename">
                                                        {file.name}
                                                    </div>
                                                    <div className="file-action">
                                                        <button type="button" className="app-file-remove"
                                                        onClick={()=>onFileRemove(index)}>
                                                            X
                                                        </button>
                                                    </div>
                                            </div>
                                        )
                                    })
                                }
                                            </div> : null
                        }


                        <div className={classNames("app-file-select-zone" , {"error": _.get(errors,"files")})}>
                        {/* <div className={files.length >0? "app-file-select-zone" : "app-file-select-zone error"}> */}
                            <label>
                                <input onChange={onAddingFiles} id="input-file" type="file" multiple={true}/>
                                {
                                    files.length ? <span className="app-upload-description text-uppercase">Add more Files</span> : <span>
                                        <span className ="app-upload-icon"/>
                                            <span className="app-upload-description">
                                                Drag and Drop your files here
                                            </span>
                                    </span>
                                 }
                            </label>
                        </div>
                    </div>
                </div>
                <div className="app-card-content">
                    <div className="app-card-content-inner">
                        <div className={classNames("app-form-item",{"error":_.get(errors,"to")})}>
                            <label htmlFor="to">
                                Email to
                            </label>
                            <input onChange={tofieldTextChange} value={toMail} 
                            name ="to" 
                            placeholder={_.get(errors,"to") ? _.get(errors,"to") : "Recipient Email ID"}
                            type="text" id="to" />
                        </div>
                        <div className={classNames("app-form-item",{"error":_.get(errors,"from")})}>
                            <label htmlFor="from">
                                Your Email
                            </label>
                            <input onChange={fromFieldTextChange} value={fromMail}
                            name="from" placeholder ={_.get(errors,"from") ? _.get(errors,"from") : "Sender Email ID"} 
                            type="text" id="from" />
                        </div>
                        <div className="app-form-item">
                            <label htmlFor="message">
                                Message
                            </label>
                            <textarea onChange={messageTextChange} value={message}
                            placeholder="Add a note(optional)" id="message" name="message"/>
                        </div>
                        <div className="app-form-action">
                            <button type="submit" className="app-button primary">Send</button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default HomeForm;