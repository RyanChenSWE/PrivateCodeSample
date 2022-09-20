import { Card, Collapse, Popover, Space } from 'antd'
import { InfoSignIcon, Pane } from 'evergreen-ui'
import { numToDollars } from 'utils'

export function PriceBreakdown(props: {
  productPrice: number
  shippingCost: number
  estimatedTax: number
  fee: number
  totalCost: number
  fulfilledBy: 'amazon' | 'dreamship' | 'manual'
}) {
  const {
    productPrice,
    shippingCost,
    estimatedTax,
    fee,
    totalCost,
    fulfilledBy,
  } = props

  const totalLowerBoundText = numToDollars(totalCost - shippingCost)
  const totalUpperBoundText = numToDollars(totalCost)

  const rangeRequired = shippingCost === 0 || fulfilledBy !== 'dreamship'

  // Sets the total price to be a range if the gift is from Dreamship (due to variable shipping costs)
  const totalRangeText = rangeRequired
    ? totalUpperBoundText
    : `${totalLowerBoundText} - ${totalUpperBoundText}`

  // Sets the shipping price to be a range if the gift is from Dreamship (due to variable shipping costs)
  const shippingRangeText = rangeRequired
    ? numToDollars(shippingCost)
    : `$0.00 - ${numToDollars(shippingCost)}`

  const iconNeeded = shippingCost !== 0 && fulfilledBy === 'dreamship'

  // Defines properties of each breakdown section
  const breakdownSections = [
    { label: 'Item price:', price: productPrice },
    {
      label: 'Shipping & handling:',
      range: shippingRangeText,
      price: shippingCost,
      border: 'muted',
      icon: iconNeeded ? <InfoSignIcon color="disabled" size={12} /> : null,
    },
    { label: 'Fee:', price: fee },
    { label: 'Estimated tax:', price: estimatedTax, border: 'muted' },
    {
      label: 'Total per recipient:',
      price: totalCost,
      range: totalRangeText,
    },
  ]

  // Defines Popover content
  const popOverContent = (
    <Pane>
      <Pane>US Shipping: $0.00</Pane>
      <Pane>International Shipping: {numToDollars(shippingCost)}</Pane>
    </Pane>
  )

  return (
    <Collapse ghost style={{ minWidth: 450 }}>
      <Collapse.Panel
        header={
          <Pane>
            Price per Recipient: {`${totalRangeText} `}
            {iconNeeded && (
              <Popover
                title="Shipping fees vary by country"
                content={popOverContent}
              >
                <InfoSignIcon
                  color="disabled"
                  size={12}
                  marginBottom={2}
                  marginLeft={2}
                />
              </Popover>
            )}
          </Pane>
        }
        key="collapseHeader"
      >
        <Card>
          <Space direction="vertical" size="small" style={{ display: 'flex' }}>
            {breakdownSections.map(({ label, icon, range, price, border }) => {
              return (
                <Pane>
                  <Pane
                    display="flex"
                    justifyContent="space-between"
                    marginX={8}
                  >
                    <Pane display="flex" flexDirection="column">
                      <Pane>
                        {label}{' '}
                        <Popover
                          title="Shipping fees vary by country"
                          content={popOverContent}
                        >
                          {icon}
                        </Popover>
                      </Pane>
                    </Pane>
                    {range || numToDollars(price)}
                  </Pane>
                  {border && <Pane borderBottom="muted" marginY={16} />}
                </Pane>
              )
            })}
          </Space>
        </Card>
      </Collapse.Panel>
    </Collapse>
  )
}
