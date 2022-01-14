import Loading from '../../system/Loading'

const OrderSummary = (props) => {
  const order = props.orderData

  let tableBody = []

  order.included.forEach((orderItem) => {
    if (orderItem.type.includes('order-item')) {
      let imgUrl = ''
      order.included.forEach((purchasedItem) => {
        if (purchasedItem.type.includes('product-variation')
          && orderItem.relationships.purchased_entity.data.id ===
          purchasedItem.id) {
          order.included.forEach((purchaseItemImage) => {
            if (purchaseItemImage.type.includes('file--file') &&
              purchaseItemImage.id === purchasedItem.relationships.field_product_images.data[0].id) {
              imgUrl = purchaseItemImage.attributes.image_style_uri.thumbnav
            }
          })
        }
      })

      const quantity = orderItem.attributes.quantity * 1
      const itemTitle = orderItem.attributes.title
      const itemTotalPrice = orderItem.attributes.total_price.formatted

      const tableRow = {
        'img': imgUrl,
        'qty': quantity,
        'title': itemTitle,
        'price': itemTotalPrice
      }
      tableBody.unshift(tableRow)
    }
  })

  return (
    <>
      {
        order && order.included && tableBody ?
          <><table
            className='uk-table uk-table-divider uk-table-small uk-table-middle'
          ><tbody>
              {tableBody.map((row, index) => {
                return (
                  <tr key={index}>
                    <td><img src={row.img} alt={row.title} /></td>
                    <td className='uk-padding-small'>{'Q' + row.qty}</td>
                    <td>
                      <span>{row.title.split(' - ')[0]}</span>
                      <div className='uk-text-secondary uk-text-italic'>{row.title.split(' - ')[1]}</div>
                    </td>
                    <td>{row.price}</td>
                  </tr>
                )
              })}
            </tbody>
            <tfoot>
              <tr>
                <td></td><td></td>
                <td>
                  SubTotal
                </td>
                <td
                  style={{ fontWeight: 'bold' }}
                >
                  {order.data.attributes.order_total.subtotal.formatted}
                </td>
              </tr>
            </tfoot>
          </table>
          </>
          :
          <Loading />
      }
    </>
  )
}


export default OrderSummary;