//import lagos from "./states/lagos.json"

const JumiaLogistics = () => {

    //inmported loction comprising of state and city
    const city = 'ajah'
    const state = ['lagos']

    const jumiaClassifications = ['tier1', 'tier2', 'tier3', 'tier4']
    const lagos = {
        tier1: ['ajah', 'VI', 'ikeja', 'ogba'],
        tier2: ['agege', 'ipaja'],
        tier3: ['ikorodu'],
        tier4: ['agbara'],
    }


    console.log(state)
    if (lagos['tier2'].includes('agege')) {
        console.log('yooooh nigga')
    }
    jumiaClassifications.forEach(thisTier => {
        console.log(thisTier)
        var tierStated = toString(state)
        console.log(state[thisTier])

        //if (state[element].includes('ajah')) {
        console.log(
            'specific tier is:' + thisTier +
            ' calculate price ' +
            'state: ' + state + ' city: ' + city
        )
        //}
    });

    return (
        <aside>
            <ul className=''>
                <li></li>
            </ul>
        </aside>
    )
}

export default JumiaLogistics