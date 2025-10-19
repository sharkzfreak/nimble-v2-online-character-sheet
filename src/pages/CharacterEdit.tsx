import { useParams } from "react-router-dom";
import { useEffect } from "react";
import CharacterForm from "@/components/CharacterForm";
import { useCodex } from "@/contexts/CodexContext";

const CharacterEdit = () => {
  const { id } = useParams<{ id: string }>();
  const { importCharacter } = useCodex();

  useEffect(() => {
    if (id) {
      importCharacter(id);
    }
  }, [id, importCharacter]);
  
  return <CharacterForm characterId={id} />;
};

export default CharacterEdit;
