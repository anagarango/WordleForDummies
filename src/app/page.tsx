"use client"
import { useEffect, useState } from "react";
import { useToast, Box, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton} from '@chakra-ui/react'
import Image from "next/image";


type WordList = {
  word: string,
  colour: string[]
}

type Alphabet = {
  letter: string,
  colour: string
}

type ModalOpen = {
  isOpen: boolean, 
  type: "beginning" | "win" | "lose"
}

 
export default function Home() {
  const toast = useToast()
  const [answerWord, setAnswerWord] = useState<string>("")
  const [wordList, setWordList] = useState<WordList[]>([{word:"", colour:[]}, {word:"", colour:[]}, {word:"", colour:[]}, {word:"", colour:[]}, {word:"", colour:[]}, {word:"", colour:[]}])
  const [alphabet, setAlphabet] = useState<Alphabet[][]>([[{letter:"Q", colour:""}, {letter:"W", colour:""}, {letter:"E", colour:""}, {letter:"R", colour:""}, {letter:"T", colour:""}, {letter:"Y", colour:""}, {letter:"U", colour:""}, {letter:"I", colour:""}, {letter:"O", colour:""}, {letter:"P", colour:""}], [{letter:"A", colour:""}, {letter:"S", colour:""}, {letter:"D", colour:""}, {letter:"F", colour:""}, {letter:"G", colour:""}, {letter:"H", colour:""}, {letter:"J", colour:""}, {letter:"K", colour:""}, {letter:"L", colour:""}], [{letter:"Z", colour:""}, {letter:"X", colour:""}, {letter:"C", colour:""}, {letter:"V", colour:""}, {letter:"B", colour:""}, {letter:"N", colour:""}, {letter:"M", colour:""}]])
  const [currentRow, setCurrentRow] = useState<number>(0)
  const [modalOpen, setModalOpen] = useState<ModalOpen>({isOpen:true, type:"beginning"})


  const fetchWord = () => {
    try {
      // const response : Response = await fetch("/api");
      // const data = await response.json();
      const arr = ["About", "Alert", "Argue", "Beach", "Above", "Alike", "Arise", "Began", "Abuse", "Alive", "Array", "Begin", "Actor", "Allow", "Aside", "Begun", "Acute", "Alone", "Asset", "Being", "Admit", "Along", "Audio", "Below", "Adopt", "Alter", "Audit", "Bench", "Adult", "Among", "Avoid", "After", "Anger", "Award", "Birth", "Again", "Angle", "Aware", "Black", "Agent", "Angry", "Badly", "Blame", "Agree", "Apart", "Baker", "Blind", "Ahead", "Apple", "Bases", "Block", "Alarm", "Apply", "Basic", "Blood", "Album", "Arena", "Basis", "Board", "Boost", "Buyer", "China", "Cover", "Booth", "Cable", "Chose", "Craft", "Bound", "Civil", "Crash", "Brain", "Carry", "Claim", "Cream", "Brand", "Catch", "Class", "Crime", "Bread", "Cause", "Clean", "Cross", "Break", "Chain", "Clear", "Crowd", "Breed", "Chair", "Click", "Crown", "Brief", "Chart", "Clock", "Curve", "Bring", "Chase", "Close", "Cycle", "Broad", "Cheap", "Coach", "Daily", "Broke", "Check", "Coast", "Dance", "Brown", "Chest", "Could", "Dated", "Build", "Chief", "Count", "Dealt", "Built", "Child", "Court", "Death", "Debut", "Entry", "Forth", "Group", "Delay", "Equal", "Forty", "Grown", "Depth", "Error", "Forum", "Guard", "Doing", "Event", "Found", "Guess", "Doubt", "Every", "Frame", "Guest", "Dozen", "Exact", "Frank", "Guide", "Draft", "Exist", "Fraud", "Happy", "Drama", "Extra", "Fresh", "Drawn", "Faith", "Front", "Heart", "Dream", "False", "Fruit", "Heavy", "Dress", "Fault", "Fully", "Drill", "Fibre", "Funny", "Night", "Drink", "Field", "Giant", "Horse", "Drive", "Fifth", "Given", "Hotel", "Drove", "Fifty", "Glass", "House", "Dying", "Fight", "Globe", "Human", "Eager", "Final", "Going", "Ideal", "Early", "First", "Grace", "Image", "Earth", "Fixed", "Grade", "Index", "Eight", "Flash", "Grand", "Inner", "Elite", "Fleet", "Grant", "Input", "Empty", "Floor", "Grass", "Issue", "Enemy", "Fluid", "Great", "Irony", "Enjoy", "Focus", "Green", "Juice", "Enter", "Force", "Gross", "Joint", "Judge", "Metal", "Media", "Newly", "Known", "Local", "Might", "Noise", "Label", "Logic", "Minor", "North", "Large", "Loose", "Minus", "Noted", "Laser", "Lower", "Mixed", "Novel", "Later", "Lucky", "Model", "Nurse", "Laugh", "Lunch", "Money", "Occur", "Layer", "Lying", "Month", "Ocean", "Learn", "Magic", "Moral", "Offer", "Lease", "Major", "Motor", "Often", "Least", "Maker", "Mount", "Order", "Leave", "March", "Mouse", "Other", "Legal", "Music", "Mouth", "Ought", "Level", "Match", "Movie", "Paint", "Light", "Mayor", "Needs", "Paper", "Limit", "Meant", "Never", "Party", "Peace", "Power", "Radio", "Round", "Panel", "Press", "Raise", "Route", "Phase", "Price", "Range", "Royal", "Phone", "Pride", "Rapid", "Rural", "Photo", "Prime", "Ratio", "Scale", "Piece", "Print", "Reach", "Scene", "Pilot", "Prior", "Ready", "Scope", "Pitch", "Prize", "Refer", "Score", "Place", "Proof", "Right", "Sense", "Plain", "Proud", "Rival", "Serve", "Plane", "Prove", "River", "Seven", "Plant", "Queen", "Quick", "Shall", "Plate", "Sixth", "Stand", "Shape", "Point", "Quiet", "Roman", "Share", "Pound", "Quite", "Rough", "Sharp", "Sheet", "Spare", "Style", "Times", "Shelf", "Speak", "Sugar", "Tired", "Shell", "Speed", "Suite", "Title", "Shift", "Spend", "Super", "Today", "Shirt", "Spent", "Sweet", "Topic", "Shock", "Split", "Table", "Total", "Shoot", "Spoke", "Taken", "Touch", "Short", "Sport", "Taste", "Tough", "Shown", "Staff", "Taxes", "Tower", "Sight", "Stage", "Teach", "Track", "Since", "Stake", "Teeth", "Trade", "Sixty", "Start", "Texas", "Treat", "Sized", "State", "Thank", "Trend", "Skill", "Steam", "Theft", "Trial", "Sleep", "Steel", "Their", "Tried", "Slide", "Stick", "Theme", "Tries", "Small", "Still", "There", "Truck", "Smart", "Stock", "These", "Truly", "Smile", "Stone", "Thick", "Trust", "Smith", "Stood", "Thing", "Truth", "Smoke", "Store", "Think", "Twice", "Solid", "Storm", "Third", "Under", "Solve", "Story", "Those", "Undue", "Sorry", "Strip", "Three", "Union", "Sound", "Stuck", "Threw", "Unity", "South", "Study", "Throw", "Until", "Space", "Stuff", "Tight", "Upper", "Upset", "Whole", "Waste", "Wound", "Urban", "Whose", "Watch", "Write", "Usage", "Woman", "Water", "Wrong", "Usual", "Train", "Wheel", "Wrote", "Valid", "World", "Where", "Yield", "Value", "Worry", "Which", "Young", "Video", "Worse", "While", "Youth", "Virus", "Worst", "White", "Worth", "Visit", "Would", "Vital", "Voice"];
      const random = Math.floor(Math.random() * arr.length);
      setAnswerWord(arr[random].toUpperCase());
      // setAnswerWord(data.word.toUpperCase());
      // console.log(data)
    } catch (error) {
      console.error('Error fetching the word:', error);
    }
  }


  const addLetter = (e:any) => {
    var currentWord : string = e.target.innerText

    if(currentWord.length == 1 && wordList[currentRow].word.length < 5){
      updateWordList(currentRow, wordList[currentRow].word + currentWord);
    }

    if(currentWord == "DEL" && wordList[currentRow].word.length >= 0){
      updateWordList(currentRow, wordList[currentRow].word.slice(0, -1));
    }

    if(currentWord == "ENT"){
      if(wordList[currentRow].word.length < 5){
        toast({
          position: 'bottom-right',
          duration: 3000,
          isClosable: true,
          render: () => (
            <Box color='white' p={3} bg='#EF7547'>
              <p style={{fontSize:"14px"}}>Word isn't 5 letters</p>
            </Box>
          ),
        })
      } else {
        submitWord()
      }
    }
  }


  const updateWordList = (row: number, word: string) => {
    setWordList((prevList) => {
      const newList : WordList[] = [...prevList];
      newList[row].word = word;
      return newList;
    });
  };


  const submitWord = async () => {
    try {
      const response : Response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${wordList[currentRow].word}`);
      const data = await response.json();
      const colors : string[] = []
      if(data[0]){
        for(var x = 0; x < wordList[currentRow].word.length; x++){
          var determineLetterColour = ""

          if(wordList[currentRow].word[x] == answerWord[x]){
            determineLetterColour = "#8BB47B"
          } else if (answerWord.includes(wordList[currentRow].word[x])){
            determineLetterColour = "#F3C665"
          } else {
            determineLetterColour = "#EF7547"
          }

          changeKeyboard(wordList[currentRow].word[x], determineLetterColour)
          colors.push(determineLetterColour)
        }

        setWordList((prevArray) => {
          const newArray : WordList[] = [...prevArray];
          newArray[currentRow].colour = colors;
          return newArray;
        });
        
        solvedWord()
        setCurrentRow(currentRow+1)
        
      } else {
        toast({
          position: 'bottom-right',
          duration: 4000,
          isClosable: true,
          render: () => (
            <Box color='white' p={3} bg='#EF7547'>
              <p style={{fontSize:"14px"}}>Word doesn't exist</p>
            </Box>
          ),
        })
      }
    } catch (error) {
      console.error('Error fetching the word:', error);
    }
  }


  const solvedWord = () => {
    if(currentRow > 4){
      setTimeout(() => {
        if(wordList[currentRow].word == answerWord){
          setModalOpen({isOpen: true, type:"win"})
        } else {
          setModalOpen({isOpen: true, type:"lose"})
        }
      }, 2000);
    } else if(wordList[currentRow].word == answerWord){
      setTimeout(() => {
        setModalOpen({isOpen: true, type:"win"})
      },2000)
      return
    }
  }


  const changeKeyboard = (typingLetter:string, determineLetterColour:string) => {
    for(var y = 0; y < alphabet.length; y++){
      for(var z = 0; z < alphabet[y].length; z++){
        if(typingLetter == alphabet[y][z].letter){
          const newArray : Alphabet[][] = [...alphabet];
          newArray[y][z].colour = determineLetterColour
          setAlphabet(newArray)
        }
      }
    }
  }


  useEffect(()=>{
    fetchWord()
  },[])  

  return (
    <main className="main">
      <div style={{display:"flex"}}>
        <Image src="/wordle.gif" alt="wordle for dummies of gif" width={25} height={25}/>
        <h2 style={{textAlign:"center", paddingLeft:"10px"}}>Wordle for Dummies</h2>
      </div>
      
      <div className="keyboardSection puzzleSection">
        {wordList.map((object, index)=>{
          return (
            <div key={index} className="wordRow">
              <h3 className="currentWord" style={{backgroundColor: wordList[index].colour[0] ? wordList[index].colour[0] : "#98BEB7"}}>{wordList[index].word[0]}</h3>
              <h3 className="currentWord" style={{backgroundColor: wordList[index].colour[1] ? wordList[index].colour[1] : "#98BEB7"}}>{wordList[index].word[1]}</h3>
              <h3 className="currentWord" style={{backgroundColor: wordList[index].colour[2] ? wordList[index].colour[2] : "#98BEB7"}}>{wordList[index].word[2]}</h3>
              <h3 className="currentWord" style={{backgroundColor: wordList[index].colour[3] ? wordList[index].colour[3] : "#98BEB7"}}>{wordList[index].word[3]}</h3>
              <h3 className="currentWord" style={{backgroundColor: wordList[index].colour[4] ? wordList[index].colour[4] : "#98BEB7"}}>{wordList[index].word[4]}</h3>
            </div>
          )
        })}
      </div>

     <div className="keyboardSection" onClick={(e)=>addLetter(e)}>
        {alphabet.map((row, rowIndex)=>{
          return (
            <div key={rowIndex} className="wordRow keyboardRow">
              {row.map((letter, letterIndex)=>{
                return (
                  <div key={letterIndex} className="keyboardLetter" style={{backgroundColor: letter.colour ? letter.colour : "white", fontSize:"0.9rem"}}>{letter.letter}</div>
                )
              })}
            </div>
          )
        })}
        <div className="wordRow keyboardRow delEntRow">
          <div className="keyboardLetter delEnt" style={{backgroundColor:"white", fontSize:"0.9rem"}}>DEL</div>
          <div className="keyboardLetter delEnt" style={{backgroundColor:"white", fontSize:"0.9rem"}}>ENT</div>
        </div>
      </div>

      <Modal isCentered={true} onClose={(() => setModalOpen({...modalOpen, isOpen: false }))} isOpen={modalOpen.isOpen}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          {modalOpen.type == "beginning" && 
            <>
              <ModalHeader>Wordle for Dummies</ModalHeader>
              <ModalBody>
                <h4>Rules:</h4>
                <ul style={{padding:"5px 25px 25px 25px", fontSize:"13px"}}>
                  <li style={{padding:"10px 0"}}>Each guess must be a valid five-letter word.</li>
                  <li style={{padding:"10px 0"}}>The color of a tile will change to show you how close your guess is.</li>
                  <li style={{padding:"10px 0"}}>If the tile turns <span style={{color:"#8BB47B"}}>green</span>, the letter is in the word, and it is in the correct spot.</li>
                  <li style={{padding:"10px 0"}}>If the tile turns <span style={{color:"#F3C665"}}>yellow</span>, the letter is in the word, but it is not in the correct spot.</li>
                  <li style={{padding:"10px 0"}}>If the tile turns <span style={{color:"#EF7547"}}>orange</span>, the letter is not in the word.</li>
                </ul>
              </ModalBody>
            </>
          }

          {(modalOpen.type == "lose" || modalOpen.type == "win") && 
            <>
              <ModalHeader>{modalOpen.type == "lose" ? "You Lose" : "You Win!"}</ModalHeader>
              
              <ModalBody>
                {modalOpen.type == "lose" && 
                  <Box display="flex" flexDirection="column" alignItems="center">
                    <h6>The Word was</h6>
                    <h4 style={{margin:"10px 0",fontSize:"24px"}}>{answerWord}</h4>
                  </Box>
                }
                <Button style={{margin:"20px 0", fontSize:"14px"}} onClick={()=>{
                  fetchWord();
                  setWordList([{word:"", colour:[]}, {word:"", colour:[]}, {word:"", colour:[]}, {word:"", colour:[]}, {word:"", colour:[]}, {word:"", colour:[]}]);
                  setAlphabet([[{letter:"Q", colour:""}, {letter:"W", colour:""}, {letter:"E", colour:""}, {letter:"R", colour:""}, {letter:"T", colour:""}, {letter:"Y", colour:""}, {letter:"U", colour:""}, {letter:"I", colour:""}, {letter:"O", colour:""}, {letter:"P", colour:""}], [{letter:"A", colour:""}, {letter:"S", colour:""}, {letter:"D", colour:""}, {letter:"F", colour:""}, {letter:"G", colour:""}, {letter:"H", colour:""}, {letter:"J", colour:""}, {letter:"K", colour:""}, {letter:"L", colour:""}], [{letter:"Z", colour:""}, {letter:"X", colour:""}, {letter:"C", colour:""}, {letter:"V", colour:""}, {letter:"B", colour:""}, {letter:"N", colour:""}, {letter:"M", colour:""}]]);
                  setCurrentRow(0);
                  setModalOpen({...modalOpen, isOpen: false})
                }}>Play New Word</Button>
              </ModalBody>
            </>
          }
        </ModalContent>
      </Modal>
    </main>
  );
}