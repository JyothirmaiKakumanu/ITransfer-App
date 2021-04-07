import axios from 'axios';
import {apiUrl} from "../config";
import _ from 'lodash';

export const upload = (fromMail,toMail,message,files,callback= ()=>{})=> {
   
    const url =`${apiUrl}/upload`;
    let data = new FormData();

    _.each(files,(file)=>{
        data.append('files',file);
    })

    const config={
        onUploadProgress: (event)=>{
            console.log("Upload event");
            return callback({
                type: 'onUploadProgress',
                payload: event,
            })
        }
    }

    axios.post(url,data, config).then((response)=>{
        //upload successful
        return callback({
            type: 'success',
            payload: response.data,
        })
    }).catch((err)=>{
        return callback({
            type: 'error',
            payload: err,
        })
    })

};

