"use client"
import { useEffect, useState } from "react";
import { useToast, Box, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton} from '@chakra-ui/react'


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
  const [alphabet, setAlphabet] = useState<Alphabet[][]>([[{letter:"Q", colour:""}, {letter:"W", colour:""}, {letter:"E", colour:""}, {letter:"R", colour:""}, {letter:"T", colour:""}, {letter:"Y", colour:""}, {letter:"U", colour:""}, {letter:"I", colour:""}, {letter:"O", colour:""}, {letter:"P", colour:""}], [{letter:"A", colour:""}, {letter:"S", colour:""}, {letter:"D", colour:""}, {letter:"F", colour:""}, {letter:"G", colour:""}, {letter:"H", colour:""}, {letter:"J", colour:""}, {letter:"K", colour:""}, {letter:"L", colour:""}], [{letter:"DEL", colour:""}, {letter:"Z", colour:""}, {letter:"X", colour:""}, {letter:"C", colour:""}, {letter:"V", colour:""}, {letter:"B", colour:""}, {letter:"N", colour:""}, {letter:"M", colour:""}, {letter:"ENTER", colour:""}]])
  const [currentRow, setCurrentRow] = useState<number>(0)
  const [modalOpen, setModalOpen] = useState<ModalOpen>({isOpen:true, type:"beginning"})


  const fetchWord = async () => {
    try {
      const response : Response = await fetch("/api");
      const data = await response.json();
      setAnswerWord(data.word.toUpperCase());
      console.log(data.word)
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

    if(currentWord == "ENTER"){
      submitWord()
      return
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
      <h2 style={{textAlign:"center"}}>Wordle for Dummies</h2>
      <div className="keyboardSection">
        {wordList.map((object, index)=>{
          return (
            <div className="wordRow">
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
            <div key={rowIndex} className="wordRow">
              {row.map((letter, letterIndex)=>{
                return (
                  <h6 key={letterIndex} className="keyboardLetter" style={{backgroundColor: letter.colour ? letter.colour : "white"}}>{letter.letter}</h6>
                )
              })}
            </div>
          )
        })}
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
                {modalOpen.type == "lose" && <Box display="flex" flexDirection="column" alignItems="center">
                  <h6>The Word was</h6>
                  <h4 style={{margin:"10px 0",fontSize:"24px"}}>{answerWord}</h4>
                </Box>}
                <Button style={{margin:"20px 0", fontSize:"14px"}} onClick={()=>{
                  fetchWord();
                  setWordList([{word:"", colour:[]}, {word:"", colour:[]}, {word:"", colour:[]}, {word:"", colour:[]}, {word:"", colour:[]}, {word:"", colour:[]}]);
                  setAlphabet([[{letter:"Q", colour:""}, {letter:"W", colour:""}, {letter:"E", colour:""}, {letter:"R", colour:""}, {letter:"T", colour:""}, {letter:"Y", colour:""}, {letter:"U", colour:""}, {letter:"I", colour:""}, {letter:"O", colour:""}, {letter:"P", colour:""}], [{letter:"A", colour:""}, {letter:"S", colour:""}, {letter:"D", colour:""}, {letter:"F", colour:""}, {letter:"G", colour:""}, {letter:"H", colour:""}, {letter:"J", colour:""}, {letter:"K", colour:""}, {letter:"L", colour:""}], [{letter:"DEL", colour:""}, {letter:"Z", colour:""}, {letter:"X", colour:""}, {letter:"C", colour:""}, {letter:"V", colour:""}, {letter:"B", colour:""}, {letter:"N", colour:""}, {letter:"M", colour:""}, {letter:"ENTER", colour:""}]]);
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