import Header from "@/components/layout/header"
import { FormPurchase } from "@/components/purchases/FormPurchase"

const Page = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Admin Header */}
      <Header />
      <FormPurchase />
    </div>
  )
}

export default Page
