import { useState, useEffect, useContext } from "react";
import { JwtToken } from "../App";
import validator from "validator";

const Pager = ({
  pageContents, url, reset, pagination
}) => {
  const { jwtTokenBearer } = useContext(JwtToken);

  const [offset, setOffset] = useState({ 'number': 0, 'direction': 'next' });
  const [perPageCount, setPerPageCount] = useState(6);
  const [filterUpdateTrigger, SetFilterUpdateTrigger] = useState();

  const [pagerer, setPagerer] = useState({ 'direction': '+', 'trigger': '' });
  const [pageContent, setPageContent] = useState({ 'previous': '', 'current': '', 'next': '' });
  const [firstPagerFetch, setFirstPagerFetch] = useState(true);

  const [nextActive, setNextActive] = useState(false);
  const [previousActive, setPreviousActive] = useState(false);

  useEffect(() => {
    if (pagination) {
      setPerPageCount(pagination * 1);
    }
  }, [pagination])

  let checkFilterDivElement = document.querySelector('#pager-filter');
  useEffect(() => {
    if (checkFilterDivElement) {
      checkFilterDivElement.value = perPageCount;
    }
  }, [checkFilterDivElement, perPageCount])

  const thisUrl = url;
  const thisPager = thisUrl + '&page[limit]=' + perPageCount;
  const thisOffset = offset.number > 0 ? thisPager + '&page[offset]=' + offset.number : thisPager;
  //reset mounted pager and unrelated page navigation
  useEffect(() => {
    if (url) {
      setOffset({ 'number': 0, 'direction': 'next' });
      setFirstPagerFetch(true);
      setPagerer({ 'direction': '+', 'trigger': '' });
    }
  }, [url])

  //use to controll rerendering on useEffects
  //triggered by pagerer which has multiple dependencies
  //const [pagererRenderer, setPagererRenderer] = useState();
  //use to controll rerendering on useEffects
  //triggered by filterUpdateTrigger which has multiple dependencies
  //const [filterUpdateTriggerRenderer, setFilterUpdateTriggerRenderer] = useState();
  useEffect(() => {
    let isMounted = true;
    const getContent = async () => {
      const response = await fetch(thisOffset, {
        method: 'GET',
        headers: {
          'Accept': 'application/vnd.api+json',
          'Content-type': 'application/vnd.api+json',
          'Authorization': 'Bearer ' + jwtTokenBearer,
        }
      })
      const outputData = await response.json();
      //console.log(outputData)
      if (isMounted) {
        if (outputData && outputData.data) {
          if (pagerer.direction === '+' && pagerer.trigger !== '' && firstPagerFetch === false) {
            let thisContent = pageContent;
            if (outputData.data.length > 0) {
              thisContent.next = outputData;
              setPageContent(thisContent);
              setNextActive(true);
            } else {
              //setOffset(offset.number - perPageCount);
              if (nextActive === true) {
                setNextActive(false);
              }
            }
          } else if (pagerer.direction === '-' && pagerer.trigger !== '' && firstPagerFetch === false) {
            let thisContent = pageContent;
            if (outputData.data.length >= 0 && offset.number >= 0) {
              thisContent.previous = outputData;
              setPageContent(thisContent);
              setPreviousActive(true);
            } else {
              //setOffset({ 'number': 0, 'direction': 'next' });
              if (previousActive === true) {
                setPreviousActive(false);
              }
            }
          } else if (outputData.data.length > 0 && firstPagerFetch === true) {
            setFirstPagerFetch(false);
            setPageContent({ 'previous': '', 'current': outputData, 'next': '' });
          } else {
            setFirstPagerFetch(true);
            setPageContent({ 'previous': '', 'current': '', 'next': '' });
          }
        }
      }
    }
    // if ((filterUpdateTrigger !== filterUpdateTriggerRenderer)
    //   || (pagerer !== pagererRenderer) || firstPagerFetch) {
    getContent();
    // setFilterUpdateTriggerRenderer(filterUpdateTrigger);
    // setPagererRenderer(pagerer);
    //}
    //console.log(pagerer)

    return () => {
      isMounted = false;
    };
  }, [pagerer, filterUpdateTrigger, firstPagerFetch, jwtTokenBearer,
    nextActive, offset.number, pageContent, previousActive, thisOffset])

  //use to controll rerendering on useEffects 
  //triggered by pageContent which has multiple dependencies
  const [pageContentRenderer, setPageContentRenderer] = useState();
  useEffect(() => {
    if (pageContentRenderer !== pageContent) {
      if (pageContent.next) {
        setNextActive(true);
      } else {
        if (pagerer.trigger === '' && firstPagerFetch === false) {
          setPagerer({ 'direction': '+', 'trigger': Date.now() });
          setOffset({ 'number': (offset.number + perPageCount), 'direction': 'next' });
        } else {
          setNextActive(false);
        }
      }
      if (pageContent.previous) {
        setPreviousActive(true);
      } else {
        setPreviousActive(false);
      }
      setPageContentRenderer(pageContent);
    }
  }, [pageContent, firstPagerFetch, offset.number,
    pagerer.trigger, perPageCount, pageContentRenderer])

  const nextPage = (e) => {
    //console.log(e);
    let offsetValue = '';
    if (offset.direction === 'next' || offset.direction === 'previous-') {
      offsetValue = offset.number + perPageCount;
    } else {
      offsetValue = offset.number + (perPageCount * 3);
    }
    let currentContent = pageContent.current;
    let nextContent = pageContent.next;
    if (nextContent) {
      if (offset.direction === 'previous') {
        setOffset({ 'number': offsetValue, 'direction': 'previous-' });
      } else {
        setOffset({ 'number': offsetValue, 'direction': 'next' });
      }
      setPageContent({ 'previous': currentContent, 'current': nextContent, 'next': '' });
      setPagerer({ 'direction': '+', 'trigger': Date.now() });
    }
  }

  const previousPage = (e) => {
    //console.log(e);
    let offsetValue = '';
    if (offset.direction === 'previous' || offset.direction === 'next-') {
      offsetValue = offset.number - perPageCount;
    } else {
      offsetValue = offset.number - (perPageCount * 3);
    }
    let currentContent = pageContent.current;
    let previousContent = pageContent.previous;
    if (offset.direction === 'next') {
      setOffset({ 'number': offsetValue, 'direction': 'next-' });
    } else {
      setOffset({ 'number': offsetValue, 'direction': 'previous' });
    }

    if (previousContent) {
      setPageContent({ 'previous': '', 'current': previousContent, 'next': currentContent });
      setPagerer({ 'direction': '-', 'trigger': Date.now() });
    }
  }
  //console.log(pageContent)
  //use to controll rerendering on useEffects 
  //triggered by pageContent which has multiple dependencies
  const [pageContentsRenderer, setPageContentsRenderer] = useState();
  useEffect(() => {
    if (pageContentsRenderer !== pageContent) {
      if (pageContent && pageContent.current) {
        pageContents(pageContent);
      } else {
        pageContents();
      }
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
      // let getPageTitleById = document.getElementById('pageTitle');
      // if (getPageTitleById && pageContent.previous) {
      //   getPageTitleById.scrollIntoView({
      //     behavior: 'smooth',
      //     block: 'start',
      //     inline: 'start'
      //   });
      // };
      // console.log(getPageTitleById)
      setPageContentsRenderer(pageContent);
    }
  }, [pageContent, pageContents, pageContentsRenderer])

  const [numberFilterError, setNumberFilterError] = useState(false);
  //submit filters to controllers
  const [pageCounter, setPageCounter] = useState();

  const pageCountController = (e) => {
    const numberValue = e.target.value;
    if (validator.isInt(numberValue, { min: 2, max: 20 })) {
      setPageCounter(numberValue * 1);
      setNumberFilterError(false);
    } else {
      setNumberFilterError(true);
    }
  }

  const submitFilters = (e) => {
    e.preventDefault();
    //import each filters into here and conditionally check for each's value
    if (numberFilterError === false) {
      if (pageCounter && pageCounter !== perPageCount) {
        reset();
        setPerPageCount(pageCounter);
        setOffset({ 'number': 0, 'direction': 'next' });
        setPagerer({ 'direction': '+', 'trigger': '' });
        setFirstPagerFetch(true);
        SetFilterUpdateTrigger(Date.now());
      }
      window.scrollTo({
        top: 250,
        left: 0,
        behavior: 'smooth'
      });
      e.target.parentNode.classList.add('uk-hidden');
      document.querySelector('#pager-filter').value = pageCounter;
    }
  }
  const filtersVisibility = (e) => {
    const filterForm = e.target.parentNode.parentNode.childNodes[0];
    if (filterForm.classList.contains('uk-hidden')) {
      filterForm.classList.remove('uk-hidden');
      e.target.value = '˅';
    } else {
      filterForm.classList.add('uk-hidden');
      e.target.value = '^';
    }
  }
  //console.log(pageContent.current)
  return (
    pageContent && pageContent.current ?
      <div
        className={'uk-width-1-1 uk-margin-large-top uk-text-center'}
        style={{ position: 'sticky', bottom: '7px' }}
      >
        <div id='page-filter-container' className={'uk-hidden'}>
          <form
            onSubmit={submitFilters}
            id='page-filter'
            className={'uk-card-body uk-card-primary-light uk-position-bottom-center uk-margin-large-bottom'}
          >
            <div className={'uk-card-body uk-card-default'} >
              <div>
                <div className={'form-item'}>
                  <label className={'uk-margin-right'}
                    htmlFor={'pager-filter'}
                  >Item per page</label>
                  <input
                    type='number'
                    min={2}
                    max={20}
                    defaultValue={perPageCount}
                    id={'pager-filter'}
                    onChange={pageCountController}
                  />
                </div>
                <div>
                  {numberFilterError === true ?
                    'Try > 1, < 20'
                    : ''}
                </div>
              </div>
              <input
                type='submit'
                value='Filter'
                className={'uk-button uk-margin-top'}
              />
              <button className={'uk-modal-close-default'}
                data-uk-close></button>
            </div>
          </form>
        </div>
        <nav className={'uk-flex uk-flex-center'}
          style={{ maxWidth: '720px', margin: 'auto' }}
        >
          <input
            type='button'
            value={'^'}
            onClick={filtersVisibility}
            className={'uk-button uk-text-lowercase'}
            style={{
              borderRadius: '25px', padding: '0 10px',
              marginLeft: '-58px', marginRight: '20px'
            }}
          />
          <section>
            <input
              type='button'
              value={'<'}
              className={'uk-button'}
              onClick={previousPage}
              disabled={previousActive === true ? false : true}
              style={{
                borderRadius: '25px'
              }}
            />
            <input
              type='button'
              value={'>'}
              className={'uk-button'}
              onClick={nextPage}
              disabled={nextActive === true ? false : true}
              style={{
                borderRadius: '25px'
              }}
            />
          </section>
        </nav>
      </div>
      : ''
  )
}

export default Pager