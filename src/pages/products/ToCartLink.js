import { useState, useEffect, useContext } from 'react'
//import { useHistory } from 'react-router-dom';
import { config } from '../../DrupalUrl';
import { JwtToken, LoggedStatus } from "../../App";
import toast, { Toaster } from 'react-hot-toast';

const siteJsonUrl = config.url.SITE_JSON_URL
const ToCartLink = (props) => {
}

export default ToCartLink