import { useParams } from "react-router-dom";
import CharacterForm from "@/components/CharacterForm";

const CharacterEdit = () => {
  const { id } = useParams<{ id: string }>();
  
  return <CharacterForm characterId={id} />;
};

export default CharacterEdit;
