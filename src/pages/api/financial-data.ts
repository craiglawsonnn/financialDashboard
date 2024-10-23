import type { NextApiRequest, NextApiResponse } from 'next'

type FinancialData = {
  symbol: string
  price: number
  change: number
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<FinancialData[]>
) {
  // This is mock data. In a real application, you would fetch this from an external API.
  const mockData: FinancialData[] = [
    { symbol: 'AAPL', price: 150.25, change: 1.5 },
    { symbol: 'GOOGL', price: 2750.80, change: -0.3 },
    { symbol: 'MSFT', price: 305.15, change: 0.8 },
  ]

  res.status(200).json(mockData)
}
