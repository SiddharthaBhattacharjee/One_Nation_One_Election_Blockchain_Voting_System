import './App.css';
import metamaskimg from './images/metamask.png';
import React, { useState, useEffect } from 'react';
import { VoteContractAddress } from './config.js';
import { ethers } from 'ethers';
import { Web3Provider } from '@ethersproject/providers';
import VoteAbi from './utils/VoteContract.json';
import OwnerPart from './components/OwnerPart';
import { getAddress } from 'ethers';
import Top from './components/Top';
import VoteBox from './components/VoteBox';
import Overlay from './components/Overlay';

function App() {

  const [currentAccount, setCurrentAccount] = useState(''); //fetched from metamask
  const [correctNetwork, setCorrectNetwork] = useState(false); //fetched from metamask
  const [isOwner, setIsOwner] = useState(false); // fetched from smart contract, not editable
  const [isVoter, setIsVoter] = useState(true);
  const [constituency, setConstituency] = useState(0);
  const [isVotingEnabled, setIsVotingEnabled] = useState(false); // fetched from smart contract, edited by toggleIsVE
  const [voted, setVoted] = useState(false);
  const [candidateList, setCandidateList] = useState([]);
  const [candidateVotes, setCandidateVotes] = useState([]);
  const [candidateConstituency, setCandidateConstituency] = useState([]);
  const [isOverlay,setIsOverlay] = useState(false);
  const [myCandidates, setMyCandidates] = useState([]);

  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        alert('Metamask Not Found ! Get MetaMask and Try Again.');
        return;
      }

      let chainId = await ethereum.request({ method: 'eth_chainId' });

      const shardeumChainId = "0xaa36a7";
      //'0xa869'; Avex
      console.log(chainId);
      if (chainId !== shardeumChainId) {
        alert('Please Connect to shardeum Testnet');
        return;
      }
      else {
        setCorrectNetwork(true);
      }

      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  }

  const checkOwner = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        //setting up provider
        const provider = new Web3Provider(ethereum);
        const signer = provider.getSigner();
        const VoteContract = new ethers.Contract(VoteContractAddress, VoteAbi.abi, signer);
        //calling the smart contract
        let isownercheck = await VoteContract.isOwner();
        setIsOwner(isownercheck);
      }
      else {
        console.log('Ethereum object not found');
      }
    } catch (error) {
      console.log(error);
    }
  }

  const getVoted = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        //setting up provider
        const provider = new Web3Provider(ethereum);
        const signer = provider.getSigner();
        const VoteContract = new ethers.Contract(VoteContractAddress, VoteAbi.abi, signer);
        //calling the smart contract
        let votedCheck = await VoteContract.hasVoted();
        setVoted(votedCheck);
      }
      else {
        console.log('Ethereum object not found');
      }
    } catch (error) {
      console.log(error);
    }
  }


  const getCandidates = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        //setting up provider
        const provider = new Web3Provider(ethereum);
        const signer = provider.getSigner();
        const VoteContract = new ethers.Contract(VoteContractAddress, VoteAbi.abi, signer);
        //calling the smart contract
        let candidateData = await VoteContract.getCandidateData();
        setCandidateList(candidateData);
      }
      else {
        console.log('Ethereum object not found');
      }
    } catch (error) {
      console.log(error);
    }
  }

  const getCandidateVotes = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        //setting up provider
        const provider = new Web3Provider(ethereum);
        const signer = provider.getSigner();
        const VoteContract = new ethers.Contract(VoteContractAddress, VoteAbi.abi, signer);
        //calling the smart contract
        let res = await VoteContract.getResult();
        setCandidateVotes(res);
      }
      else {
        console.log('Ethereum object not found');
      }
    } catch (error) {
      console.log(error);
    }
  }

  const getCandidateConstituencies = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        //setting up provider
        const provider = new Web3Provider(ethereum);
        const signer = provider.getSigner();
        const VoteContract = new ethers.Contract(VoteContractAddress, VoteAbi.abi, signer);
        //calling the smart contract
        let res = await VoteContract.getConstituencyCandidate();
        setCandidateConstituency(res);
      }
      else {
        console.log('Ethereum object not found');
      }
    } catch (error) {
      console.log(error);
    }
  }

  const checkIsVoteEnabled = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        //setting up provider
        const provider = new Web3Provider(ethereum);
        const signer = provider.getSigner();
        const VoteContract = new ethers.Contract(VoteContractAddress, VoteAbi.abi, signer);
        //calling the smart contract
        let isVEcheck = await VoteContract.isVotingEnabled(constituency);
        setIsVotingEnabled(isVEcheck);
      }
      else {
        console.log('Ethereum object not found');
      }
    } catch (error) {
      console.log(error);
    }
  }

  const checkIsVoteEnabledOwner = async (cons) => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        //setting up provider
        const provider = new Web3Provider(ethereum);
        const signer = provider.getSigner();
        const VoteContract = new ethers.Contract(VoteContractAddress, VoteAbi.abi, signer);
        //calling the smart contract
        let isVEcheck = await VoteContract.isVotingEnabled(cons);
        return isVEcheck;
      }
      else {
        console.log('Ethereum object not found');
      }
    } catch (error) {
      console.log(error);
    }
  }

  const checkIsVoter = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        //setting up provider
        const provider = new Web3Provider(ethereum);
        const signer = provider.getSigner();
        const VoteContract = new ethers.Contract(VoteContractAddress, VoteAbi.abi, signer);
        //calling the smart contract
        const validatedAddressArg = getAddress(currentAccount);
        let isVoterCheck = await VoteContract.isWhitelisted(validatedAddressArg);
        setIsVoter(isVoterCheck);
      }
      else {
        console.log('Ethereum object not found');
      }
    } catch (error) {
      console.log(error);
    }
  }

  const checkConstituency = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        //setting up provider
        const provider = new Web3Provider(ethereum);
        const signer = provider.getSigner();
        const VoteContract = new ethers.Contract(VoteContractAddress, VoteAbi.abi, signer);
        //calling the smart contract
        const validatedAddressArg = getAddress(currentAccount);
        let constituency = await VoteContract.getConstituency(validatedAddressArg);
        //----------------------------------------------------------------
        setConstituency(constituency);
      }
      else {
        console.log('Ethereum object not found');
      }
    } catch (error) {
      console.log(error);
    }
  }

  const toggleisve = async (cons) => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        //setting up provider
        const provider = new Web3Provider(ethereum);
        const signer = provider.getSigner();
        console.log('signer : ', signer);
        const VoteContract = new ethers.Contract(VoteContractAddress, VoteAbi.abi, signer);
        console.log('VoteContract : ', VoteContract);
        //calling the smart contract
        VoteContract.toggleVotingEnabled(cons).then(
          response => {
            console.log('toggleVotingEnabled : ', response);
          }
        ).catch(err => {
          console.log(err);
        });

      }
      else {
        console.log('Ethereum object not found');
      }
    } catch (error) {
      console.log(error);
    }
  }

  const addCandidate = async (name,cons) => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        //setting up provider
        const provider = new Web3Provider(ethereum);
        const signer = provider.getSigner();
        console.log('signer : ', signer);
        const VoteContract = new ethers.Contract(VoteContractAddress, VoteAbi.abi, signer);
        console.log('VoteContract : ', VoteContract);
        //calling the smart contract
        let intcons = parseInt(cons);
        let strname = name.toString()
        console.log("Name:", name, "cons", cons);
        VoteContract.addCandidate(strname,cons).then(
          response => {
            setCandidateList([...candidateList, name]);
            console.log('addCandidate : ', response);
          }
        ).catch(err => {
          console.log(err);
        });

      }
      else {
        console.log('Ethereum object not found');
      }
    } catch (error) {
      console.log(error);
    }
  }

  const addToWL = async (addr,cons) => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        //setting up provider
        const provider = new Web3Provider(ethereum);
        const signer = provider.getSigner();
        console.log('signer : ', signer);
        const VoteContract = new ethers.Contract(VoteContractAddress, VoteAbi.abi, signer);
        console.log('VoteContract : ', VoteContract);
        //calling the smart contract
        const validatedAddressArg = getAddress(addr);
        let intcons = parseInt(cons);
        VoteContract.addToWhitelist(validatedAddressArg,intcons).then(
          response => {
            console.log('toggleVotingEnabled : ', response);
          }
        ).catch(err => {
          console.log(err);
        });

      }
      else {
        console.log('Ethereum object not found');
      }
    } catch (error) {
      console.log(error);
    }
  }

  const Vote = async (indexno) => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        //setting up provider
        const provider = new Web3Provider(ethereum);
        const signer = provider.getSigner();
        console.log('signer : ', signer);
        const VoteContract = new ethers.Contract(VoteContractAddress, VoteAbi.abi, signer);
        console.log('VoteContract : ', VoteContract);
        //calling the smart contract
        if(!voted){
          setIsOverlay(true);
          let intindex = parseInt(indexno);
          VoteContract.vote(intindex).then(
            response => {
              console.log('voted for : ',candidateList[intindex] );
              console.log(response);
              setVoted(true);
              setCandidateList([...candidateList]);
              setTimeout(() => {
                setIsOverlay(false);
                window.location.reload();
              }, 20000);
            }
          ).catch(err => {
            console.log(err);
            setTimeout(() => {
              setIsOverlay(false);
              window.location.reload();
            }, 6000);
          });
        }
      }
      else {
        console.log('Ethereum object not found');
      }
    } catch (error) {
      console.log(error);
      setTimeout(() => {
        setIsOverlay(false);
        window.location.reload();
      }, 6000);
    }
  }

  const RemoveFromWL = async (addr) => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        //setting up provider
        const provider = new Web3Provider(ethereum);
        const signer = provider.getSigner();
        console.log('signer : ', signer);
        const VoteContract = new ethers.Contract(VoteContractAddress, VoteAbi.abi, signer);
        console.log('VoteContract : ', VoteContract);
        //calling the smart contract
        const validatedAddressArg = getAddress(addr);
        VoteContract.removeFromWhitelist(validatedAddressArg).then(
          response => {
            console.log('toggleVotingEnabled : ', response);
          }
        ).catch(err => {
          console.log(err);
        });

      }
      else {
        console.log('Ethereum object not found');
      }
    } catch (error) {
      console.log(error);
    }
  }

  const updateMyCandidates = async () => {
    try{
      const matchingIndexes = candidateConstituency.map((value, index) => (value === constituency ? index : -1)).filter(index => index !== -1);
      setMyCandidates(matchingIndexes);
    } catch(error) {
      console.log(error);
    }
  }


  // useEffect(() => {
  //   connectWallet();
  //   checkOwner();
  //   checkConstituency();
  //   checkIsVoteEnabled();
  //   checkIsVoter();
  //   getCandidates();
  //   getCandidateVotes();
  //   getVoted();
  //   getCandidateConstituencies();
  //   updateMyCandidates();
  // }, [connectWallet, checkOwner, checkIsVoteEnabled, checkIsVoter, getCandidates, getCandidateVotes,getVoted,checkConstituency,getCandidateConstituencies,updateMyCandidates]);

  useEffect(() => {
    const interval2Sec = setInterval(() => {
      checkOwner();
      checkConstituency();
      connectWallet();
      checkIsVoteEnabled();
      checkIsVoter();
      getCandidates();
      getCandidateVotes();
      getVoted();
      getCandidateConstituencies();
      updateMyCandidates();
    }, 500); // 2000 milliseconds = 2 seconds
  
    return () => {
      clearInterval(interval2Sec);
    }; // Cleanup intervals on component unmount
  }, [connectWallet, checkOwner, checkIsVoteEnabled, checkIsVoter, getCandidates, getCandidateVotes, getVoted, checkConstituency, getCandidateConstituencies, updateMyCandidates]);
  

  const Register = async () => {
    window.open('https://metamask.io', '_blank');
  }

  return (
    <div>
      {isOverlay?(
        <Overlay/>
      ):(<></>)}
      {currentAccount === '' ? (
        <div className="loading" style={{ width: "100%", height: "100vh", display: 'flex', alignItems: "center", justifyContent: "space-evenly", flexDirection: "column" }}>
          <div style={{ display: 'flex', alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
            <div className="Metabit">VoteChain</div>
            <div className="SubMetabit">Voting made easy with Blockchain</div>
          </div>
          <div style={{ display: 'flex', alignItems: "center", justifyContent: "center", flexDirection: "column", textAlign: "center" }}>
            <div className='connectWalletButton' onClick={connectWallet}>
              Login With <img src={metamaskimg} alt="metamask" /> MetaMask
            </div>
            <div className="SubConnectWallet" onClick={Register}>Register</div>
          </div>

        </div>
      ) : !correctNetwork ? (
        <div className='flex flex-col justify-center items-center mb-20 font-bold text-2xl gap-y-3'
            style={{
              display:"flex",
              flexDirection:"column",
              justifyContent:"center",
              alignItems:"center",
              fontWeight:"bold",
              fontSize:"26px",
              width:"100%",
              height:"100vh"
            }}>
          <div>-----------------------------------------</div>
          <div>Please connect to the shardeum Testnet</div>
          <div>and reload the page</div>
          <div>-----------------------------------------</div>
        </div>
      ) : (
        isOwner ? (
          <>
            <Top uid={currentAccount} />
            <div className='ownerdiv'>
              <h1>Owner Controll Pannel</h1>
              <OwnerPart isVE={checkIsVoteEnabledOwner} toggleIsVE={toggleisve} addC={addCandidate} addTWL={addToWL} remWL={RemoveFromWL} />
              <div>
                <h4>Raw Vote Data</h4>
                <p style={{borderColor:"black",borderWidth:"2px",borderStyle:"solid",padding:"30px"}}>
                  {candidateList.map((item, index,) => [item + " : ", candidateVotes[index].toString() + " , "])}
                </p>
              </div>  
            </div>
          </>
        ) : isVoter ? (
          <div>
            <Top uid={currentAccount} />
            <div className='ownerdiv'>
              <h1>Vote For The Candidate You Support</h1>
              {myCandidates.map((item, index) => 
                <VoteBox isVEd={voted} cand={candidateList[item]} ci={item} cv={candidateVotes[item]} vote={Vote} isVEn={isVotingEnabled}/>
              )}
            </div>
          </div>
        ) : (
          <div>
            <Top uid={currentAccount} />
            <div className='flex flex-col justify-center items-center mb-20 font-bold text-2xl gap-y-3'
            style={{
              display:"flex",
              flexDirection:"column",
              justifyContent:"center",
              alignItems:"center",
              fontWeight:"bold",
              fontSize:"26px",
              width:"100%",
              height:"100vh"
            }}>
              <div>--------------------------------------------------------------</div>
              <div>Your Wallet Address is not Whitelisted</div>
              <div>Please Log in with your registered Wallet.</div>
              <div>--------------------------------------------------------------</div>
            </div>
          </div>
        )
      )}
    </div>
  );
}

export default App;
