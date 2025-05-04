"use client"
import { useParams } from "next/navigation"
import CountryDetailPage from "@/components/CountryDetailPage"

export default function CountryPage() {
  const params = useParams()
  const countryId = params.countryId

  return <CountryDetailPage countryId={countryId} />
}
