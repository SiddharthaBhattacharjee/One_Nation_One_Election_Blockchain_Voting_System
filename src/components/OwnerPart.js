import { useState } from 'react';
import { List, ListItem, ListItemAvatar, ListItemText, TextField } from '@mui/material';
import { Button } from "@mui/material";
import './OwnerPart.css';


const OwnerPart = (props) => {
    let [IVE, setIVE] = useState(false); // needs to be updated addCandidate addtoWL toggleve-
    let [input_candidate,setInput_candidate] = useState("");
    let [consVal, setConsVal] = useState("");
    let [input_candidate_cons,setInput_candidate_cons] = useState("");
    let [input_addWL,setInput_addWL] = useState("");
    let [input_addWL_cons,setInput_addWL_cons] = useState("");
    let [input_removeWL,setInput_removeWL] = useState("");
    let data = "";

    const getVE = async () => {
        let res = await props.isVE(consVal);
        setIVE(res);
    }

    const toggleIsVELocal = async () => {
        console.log("toggleIsVELocal");
        await props.toggleIsVE(consVal);
        setIVE(!IVE);
        console.log("toggleIsVELocal done");
    }

    const addCandidateLocal = async() => {
        console.log("Adding Candidate");
        console.log("Passing name : ",input_candidate);
        console.log("Passing cons: ",input_candidate_cons);
        await props.addC(input_candidate,input_candidate_cons);
        console.log("Candidate Added");
    }

    const addToWhiteList = async() => {
        console.log("Whitelisting user : ",input_addWL);
        console.log("Whitelisting constituency : ",input_addWL_cons);
        await props.addTWL(input_addWL,input_addWL_cons);
        console.log("Whitelisted!");
    }

    const removeFromWhiteList = async() => {
        console.log("UnWhitelisting user : ",input_removeWL);
        await props.remWL(input_removeWL);
        console.log("UnWhitelisted!");
    }

    // Needed elements : D)toggleVoteEnabled, D)addCandidate, D)addtowhitelist, removefromwhitelist, 

    return (
        <>
            <List className='controllItem' style={{ paddingRight: '16px' }}>
                <ListItem className='muili'>
                    <ListItemText primary="Is Voting Enabled : " />
                    <ListItemText primary={IVE ? 'True' : 'False'} />
                    <TextField
                        id="standard-read-only-input"
                        label="Constituency ID"
                        variant="standard"
                        style={{width:'10rem'}}
                        onChange={e => { setConsVal(e.target.value) }}
                    />
                </ListItem>
                <Button className='muibtn' variant="contained" color="primary" style={{marginRight:'1rem'}} onClick={getVE}>Check</Button>
                <Button className='muibtn' variant="contained" color="primary" onClick={toggleIsVELocal}>Toggle</Button>
            </List>

            <List className='controllItem' style={{ paddingRight: '16px' }}>
                <ListItem className='muili'>
                    <ListItemText primary="Add New Candidate : "/>
                    <TextField
                        id="standard-read-only-input"
                        label="Candidate Name"
                        variant="standard"
                        style={{marginRight:'1rem'}}
                        onChange={e => { setInput_candidate(e.target.value) }}
                    />
                    <TextField
                        id="standard-read-only-input"
                        label="Candidate Constituency"
                        variant="standard"
                        onChange={e => { setInput_candidate_cons(e.target.value) }}
                    />
                </ListItem>

                <Button className='muibtn' variant="contained" color="primary" onClick={addCandidateLocal} >Add Candidate</Button>
            </List>

            <List className='controllItem' style={{ paddingRight: '16px' }}>
                <ListItem className='muili'>
                    <ListItemText primary="Add Users To Whitelist : "/>
                    <TextField
                        id="standard-read-only-input"
                        label="Wallet Address"
                        variant="standard"
                        style={{marginRight:'1rem'}}
                        onChange={e => { setInput_addWL(e.target.value) }}
                    />
                    <TextField
                        id="standard-read-only-input"
                        label="Constituency ID"
                        variant="standard"
                        onChange={e => { setInput_addWL_cons(e.target.value) }}
                    />
                </ListItem>

                <Button className='muibtn' variant="contained" color="primary" onClick={addToWhiteList} >Whitelist Address</Button>
            </List>

            <List className='controllItem' style={{ paddingRight: '16px' }}>
                <ListItem className='muili'>
                    <ListItemText primary="Remove Users from Whitelist : "/>
                    <TextField
                        id="standard-read-only-input"
                        label="Wallet Address"
                        variant="standard"
                        onChange={e => { setInput_removeWL(e.target.value) }}
                    />
                </ListItem>

                <Button className='muibtn' variant="contained" color="primary" onClick={removeFromWhiteList} >UNWhitelist Address</Button>
            </List>
        </>
    );
}

export default OwnerPart;