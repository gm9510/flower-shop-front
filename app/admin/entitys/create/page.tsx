import { FormEntity } from "@/components/entitys/FormEntity"
import Header from "@/components/layout/header"

const Page = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Admin Header */}
      <Header />
      <FormEntity />
    </div>
  )
}

export default Page
