import React, { useEffect, useState } from "react";
import SuggestionList from "./SuggestionList";
import { useClickOutside } from "../../hooks/useClickOutside";
import { useCallback } from "react";
import useDebounce from "../../hooks/useDebounce";
import InputField from "./InputField";

const SearchBar = ({ fetchSuggestions }) => {
  const [value, setValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const ref = useClickOutside(() => setShowSuggestions(false));

  const getSuggestions = async (key) => {
    setSuggestions(await fetchSuggestions(key));
  };

  const debouncedGetSuggestions = useCallback(
    useDebounce(getSuggestions, 300),
    []
  );

  async function handleOnChange(e) {
    const key = e.target.value;
    setValue(key);
    if (key === "") return;
    debouncedGetSuggestions(key);
  }

  function handleSearchInputClear(e) {
    setValue("");
  }

  return (
    <div className="m-4 relative inline-block" ref={ref}>
      <InputField
        value={value}
        handleOnChange={handleOnChange}
        handleSearchInputClear={handleSearchInputClear}
      />

      {suggestions.length > 0 && (
        <SuggestionList
          suggestions={suggestions}
          query={value}
          showSuggestions={showSuggestions}
          setShowSuggestions={setShowSuggestions}
        />
      )}
    </div>
  );
};

export default SearchBar;
