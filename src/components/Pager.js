import { useState, useEffect, useContext } from "react";
import { JwtToken } from "../App";
import validator from "validator";
import UIkit from "uikit";
// import { PagerFilter } from ".Pager";

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
        window.scrollTo({
          top: 250,
          left: 0,
          behavior: 'smooth'
        });
      } else {
        pageContents();
      }
      // let getPageTitleById = document.querySelector('#pageTitle');
      // if (getPageTitleById) {
      //   console.log('getPageTitleById')
      //   getPageTitleById.scrollIntoView({
      //     behavior: 'smooth',
      //     block: 'start'
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
      const filterTable = document.querySelector('#page-filter-container-top tbody');
      if (filterTable) {
        const filterTableInput = filterTable.querySelector('#' + e.target.id);
        if (filterTableInput) {
          filterTableInput.value = numberValue;
        }
      }
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

        document.querySelector('#pager-filter').value = pageCounter;
        const filterForm = document.querySelector('#page-filter-container');
        if (filterForm) {
          UIkit.accordion(filterForm).toggle();
        }
      } else if (!pageCounter) {
        const filterValueContainer = document.querySelector('#pager-filter');
        if (filterValueContainer && filterValueContainer.value
          && filterValueContainer.value !== perPageCount) {
          reset();
          setPerPageCount(filterValueContainer.value);
          setOffset({ 'number': 0, 'direction': 'next' });
          setPagerer({ 'direction': '+', 'trigger': '' });
          setFirstPagerFetch(true);
          SetFilterUpdateTrigger(Date.now());
        }
      }
      window.scrollTo({
        top: 250,
        left: 0,
        behavior: 'smooth'
      });
    }
  }
  const filtersVisibility = () => {
    const filterForm = document.querySelector('#page-filter-container');
    if (filterForm) {
      UIkit.accordion(filterForm).toggle(0, true);
    }
  }
  //console.log(pageContent.current)
  return (
    pageContent && pageContent.current ?
      <div
        className={'uk-width-1-1 uk-margin-large-top'}
      >
        <ul id='page-filter-container' className='uk-padding-remove'
          data-uk-accordion>
          <li style={{ listStyle: 'none' }}>
            <form
              onSubmit={submitFilters}
              id='page-filter-form'
              className={'uk-card-body uk-padding-small uk-accordion-content'}
              style={{
                backgroundColor: '#9b5e4fbf', color: '#fff',
                maxWidth: '480px', margin: 'auto'
              }}
            >
              <div className={'uk-overflow-auto'}>
                <table
                  id='filter-table'
                  className='uk-table uk-table-divider uk-table-small uk-table-middle uk-table-striped'
                >
                  <tbody>
                    <tr>
                      <td className=''
                        htmlFor={'pager-filter'} >Item per page</td>
                      <td>
                        <input
                          type='number'
                          min={2}
                          max={20}
                          step={1}
                          defaultValue={perPageCount}
                          id={'pager-filter'}
                          onChange={pageCountController}
                        />
                        <div>
                          {numberFilterError === true ?
                            'Try > 1, < 20'
                            : ''}
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className='uk-text-center'>
                <input
                  id='filterSubmit'
                  type='submit'
                  value='Filter'
                  className={'uk-button uk-button-secondary uk-margin-top'}
                />
              </div>
            </form>
          </li>
        </ul >
        <nav className={'uk-flex uk-flex-center'}
          style={{ maxWidth: '720px', margin: 'auto' }}
        >
          <input
            type='button'
            value={'^'}
            onClick={filtersVisibility}
            className={'uk-button uk-text-lowercase '}
            style={{
              borderRadius: '25px', padding: '0 10px',
              marginLeft: '-50px', marginRight: '20px'
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
      </div >
      : ''
  )
}
export default Pager
export const PagerFilter = () => {
  const [numberFilterError, setNumberFilterError] = useState(false);
  const submitFilters = (e) => {
    e.preventDefault();
    const pagerSubmit = document.querySelector('#filterSubmit');
    if (pagerSubmit) {
      pagerSubmit.click()
    }
    if (!numberFilterError) {
      const filterForm = document.querySelector('#page-filter-container-top');
      if (filterForm) {
        UIkit.accordion(filterForm).toggle();
      }
      const filterFormMain = document.querySelector('#page-filter-container');
      if (filterFormMain) {
        UIkit.accordion(filterFormMain).toggle();
      }
    }
  }
  const filterChange = (e) => {
    const numberValue = e.target.value;
    if (validator.isInt(numberValue, { min: 2, max: 20 })) {
      const filterTable = document.querySelector('#page-filter-container tbody');
      if (filterTable) {
        const filterTableInput = filterTable.querySelector('#' + e.target.id);
        if (filterTableInput) {
          filterTableInput.value = numberValue;
        }
      }
      setNumberFilterError(false);
    } else {
      setNumberFilterError(true);
    }
  }

  return (
    <>
      <ul id='page-filter-container-top' className='uk-padding-remove'
        data-uk-accordion>
        <li style={{ listStyle: 'none' }}>
          <div
            style={{ cursor: 'pointer' }}
            className='uk-accordion-title uk-text-center uk-background-primary-light'>
            Filter
          </div>
          <form
            onSubmit={submitFilters}
            id='page-filter-form-top'
            className={'uk-card-body uk-padding-small uk-accordion-content'}
            style={{
              backgroundColor: '#9b5e4fbf', color: '#fff',
              maxWidth: '480px', margin: 'auto'
            }}
          >
            <div>
              <table
                id='filter-table-top'
                className='uk-table uk-table-divider uk-table-small uk-table-middle uk-table-striped'
              >
                <tbody>
                  <tr>
                    <td className=''
                      htmlFor={'pager-filter'} >Item per page</td>
                    <td>
                      <input
                        type='number'
                        min={2}
                        max={20}
                        step={1}
                        defaultValue={document.getElementById('pager-filter') ?
                          document.getElementById('pager-filter').value : '2'}
                        id={'pager-filter'}
                        onChange={filterChange}
                      />
                      <div>
                        {numberFilterError === true ?
                          'Try > 1, < 20'
                          : ''}
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className='uk-text-center'>
              <input
                type='submit'
                value='Filter'
                className={'uk-button uk-button-secondary uk-margin-top'}
              />
            </div>
          </form>
        </li>
      </ul >
    </>
  )
}