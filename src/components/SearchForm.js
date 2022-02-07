import { FaSearch } from 'react-icons/fa';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';

const SearchForm = () => {
  const history = useHistory();
  const [searchWord, setSearchWord] = useState();

  const submitSearch = (e) => {
    e.preventDefault();
    history.push('/search?' + searchWord);
  }

  return (
    <form id='searchNavBox'>
      <input
        className={'uk-input uk-form-width-small uk-width-auto uk-hidden@m'}
        type="text"
        placeholder='Search'
        onChange={(e) => { setSearchWord(e.target.value) }}
      />
      <input
        className={'uk-input uk-form-width-xsmall uk-width-auto uk-visible@m uk-hidden@l'}
        type="text"
        placeholder='Search'
        onChange={(e) => { setSearchWord(e.target.value) }}
      />
      <input
        className={'uk-input uk-form-width-small uk-width-auto uk-visible@l'}
        type="text"
        placeholder='Search'
        onChange={(e) => { setSearchWord(e.target.value) }}
      />
      <button
        className={'uk-button'}
        style={{ padding: '0 10px', backgroundColor: '#612e35', color: '#fff' }}
        onClick={submitSearch}
      ><FaSearch /></button>
    </form>
  )
}
export default SearchForm