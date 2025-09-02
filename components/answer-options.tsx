"use client"

import { Button } from "@/components/ui/button"
import { GameWord } from "@/lib/types"

interface AnswerOptionsProps {
  word: GameWord
  showResult: boolean
  selectedAnswer: string | null
  onSelect: (answer: string) => void
}

const getImageForDutchWord = (dutchWord: string): string => {
  const imageMap: { [key: string]: string } = {
    kat: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/kat.jpg-gCpdMb06azQX3hnxvCOEPRZY7LTfnB.jpeg",
    hond: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/hond.jpg-0CTvgmmsdFayq4q7uMcA1h0GmKfTXu.jpeg",
    huis: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/huis.jpg-WQws7c12ckFmSTuuQRAGpQgh8UkRoX.jpeg",
    water: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/water.jpg-L84cvJh03PpHWGMG5mmxnLHZhEpBQ1.jpeg",
    eten: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/eten.jpg-STC9PCSZIWvizAcvKzwDok5WQX2Ubq.jpeg",
    boek: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/boek.jpg-sncjlhUO3jc5gYU77fdWC3lS8pEh48.jpeg",
    auto: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/auto.jpg-nYlvQV3ctJZVTbm2WO7Fw6Kcv7zrXy.jpeg",
    zon: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/zon.jpg-SwmR93eJZNwlb1eAsX9YkyXPDyTVzs.jpeg",
    maan: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/maan.jpg-IwMkgZkSutUQRUhxYyQe1ZWkJ50Poi.jpeg",
    boom: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/boom.jpg-9YMPFjdNGFMXZQUbqQmOL8waYk8QJN.jpeg",
    tafel: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/tafel.jpg-IPLLjEloi3Uz88WkBH1mtVJfbhwgEC.jpeg",
    bloem: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/bloem.jpg-yj0UHAmqPT7iDo9JWl9uKQXn3gVqH2.jpeg",
    stoel: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/stoel.jpg-cFPZxum67QgQC0oaxyeCT2rGW5lWS3.jpeg",
    raam: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/raam.jpg-lcJhqtSCsfjhKWQVNjleV7a1Kw2ee2.jpeg",
    deur: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/deur.jpg-S6Yns5KTaXTurMeAveGIaZyd9HJrvV.jpeg",
    spel: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/spel.jpg-KJxOXzZpG9SukvaugpMfMsN3pNAZYj.jpeg",
    telefoon: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/telefoon.jpg-FUNKh11n8L17uOIqwkMbEDasExThX8.jpeg",
    internet: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/internet.jpg-quE7UWjtR2LaMcg8GJnaIZaDpX1nMM.jpeg",
    meme: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/meme.jpg-CIuKSpGUf8qTUS5Jf2AJflzxXUNpNZ.jpeg",
    video: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/video.jpg-diAuAWPhXICHTF4Mcz4QUguuUij4du.jpeg",
    muziek: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/muziek.jpg-a3HLyXxG8X523ZBDTYYempjBN2IpnZ.jpeg",
    foto: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/foto.jpg-BQDfnNcyHDkmQvVqPIwFLR3MWwEGIl.jpeg",
    chat: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/chat.jpg-cFiAeZgDB8uqR5axQPYOM9HKROUU08.jpeg",
    school: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/school.jpg-VJ2ZG34OQx0K2ZIw19l4wRAjxngy3C.jpeg",
    werk: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/werk.jpg-EAocMZiJLpCOQkvxQPBgxvFjcB4nnk.jpeg",
    familie: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/familie.jpg-btRBfWNA04UICIhWcmBn1fIrvkRuBd.jpeg",
    vriend: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/vriend.jpg-DQo2g3QWURUGplsJNvCKAisdPyPzf9.jpeg",
    vrienden: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/vrienden-QRPHbuD1RaWP8HO8gdMBHeTh8ihl1Q.png",
    tijd: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/tijd.jpg-njmPlPOVl9QDiOEr7i5VHwweVpeO7j.jpeg",
    volger: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/volger.jpg-BexUJ5vcbfccBPLq8zY7VlIakGTVuy.jpeg",
    viraal: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/viraal.jpg-GxcHXBsuuoXfQnOz16ktPD9Y9WHqNe.jpeg",
    influencer: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/influencer.jpg-yDcbujdUBcuKxEV5j5HyNxsgWAKCoA.jpeg",
    streaming: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/streaming.jpg-lGF8a6kw73pQlTReaDvlCrkC12OSnd.jpeg",
    content: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/content.jpg-m9izRhbB3vZSL2edULxxVJvxalie66.jpeg",
    algoritme: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/algoritme.jpg-jAwSG69mj44vTyRfpgEyfLB4kLE4Py.jpeg",
    notificatie: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/notificatie.jpg-dXh96RwS0FGdWDu04jvlG9MMbCqURE.jpeg",
    hashtag: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/hashtag.jpg-qrXdpkyX5BdXKuEVZR4HSX0Bdh1p0V.jpeg",
    omgaan: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/omgaan.jpg-oRwwbEutb1qSse0US0MQxdPJWrGyK3.jpeg",
    snelloop: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/snelloop.jpg-eQfdr0nUTRgojrXKYE0Gxq8D9t9tzP.jpeg",
    gebaseerd: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/gebaseerd.jpg-P028JANRqItqFoWpEidGVUmlQLahs0.jpeg",
    verdacht: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/verdacht.jpg-lzBwwij9eGjKXLoYrx5JJSZ81IZR0B.jpeg",
    vertraging: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/vertraging.jpg-VLY9a6btJivBo7r5VlEs0B0OOIqoYn.jpeg",
    pronken: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pronken.jpg-tcth8bnvAts0hWmPHB9cSo1uA4lUBz.jpeg",
    modificatie: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/modificatie.jpg-9VcKktaTsJ2l1vmDQzn1krYAtWDHJh.jpeg",
    fout: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fout.jpg-cImvenhmHjVNs7XwRwvhNFRqWhX3S3.jpeg",
    paasei: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/paasei.jpg-4AegtUBvTnfsbrBReHfxwdCcOz46Hz.jpeg",
    cringe: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/cringe.jpg-9M5fUqib3G2T7NC6alpoFDTqA7oWBl.jpeg",
    beginner: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/beginner.jpg-wvSZ3ojHyDIpMA5rAXw0fDcU4MMwIr.jpeg",
    deepfake: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/deepfake.jpg-phiUtPrwJcsCY4epUK3gtImzxmH7bV.jpeg",
    gigachad: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/gigachad.jpg-q8b7li0YZJdNQWA5ubOqYqloTv6UQ7.jpeg",
    doge: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/doge.jpg-71ts0UsagO20DgJqRvmB9Ty7ULAFRb.jpeg",
    karen: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/karen.jpg-8I0epF7BXDb9HdB0RzoTPneVEv6pmI.jpeg",
    blockchain: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/blockchain.jpg-e6nBSsVTIlCvKSyp9qNVz90PazwkWc.jpeg",
    rickroll: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/rickroll.jpg-9Xg1lwwyysz32BG9r4UKxSQc00uTc2.jpeg",
    pepe: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pepe.jpg-56C8fHHU0onFsz0OUf0fbH6mdD2P30.jpeg",
    podcast: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/podcast.jpg-vXJgosQpT94ib3yw8SXeKKGagaqh4f.jpeg",
    NFT: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/NFT.jpg-peMBpbhuUj18Q4VaFGPErOKERwfjgU.jpeg",
    metaverse: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/metaverse.jpg-XMTqRaVptw7jRyUIemnEZTKAYZejx0.jpeg",
    simp: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/simp.jpg-vxhMuABeQ8SMCppsyLUpmSNghNpCPT.jpeg",
    wojak: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/wojak.jpg-jFlU2OgzUuPa2EVABpgrW8JXlKohEq.jpeg",
  }

  return (
    imageMap[dutchWord.toLowerCase()] ||
    `/placeholder.svg?height=48&width=48&text=${encodeURIComponent(dutchWord)}`
  )
}

export function AnswerOptions({ word, showResult, selectedAnswer, onSelect }: AnswerOptionsProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {word.options.map((option, index) => {
        let buttonVariant: "default" | "secondary" | "destructive" = "secondary"

        if (showResult && selectedAnswer === option.text) {
          buttonVariant = "default"
        } else if (showResult && option.text === word.dutch) {
          buttonVariant = "default"
        }

        const imageUrl = getImageForDutchWord(option.text)

        return (
          <Button
            key={index}
            variant={buttonVariant}
            size="lg"
            onClick={() => onSelect(option.text)}
            disabled={showResult}
            className="h-20 text-lg font-semibold transition-all duration-200 hover:scale-105 font-body relative flex items-center gap-3 justify-start px-4"
          >
            <span className="absolute top-1 left-2 text-xs opacity-70">{index + 1}</span>
            <img
              src={imageUrl || "/placeholder.svg"}
              alt={`Image for ${option.text}`}
              className="w-12 h-12 object-cover rounded border-2 border-border/50 flex-shrink-0"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.src = `/placeholder.svg?height=48&width=48&text=${encodeURIComponent(option.text)}`
              }}
            />
            <span className="flex-1 text-center">{option.text}</span>
          </Button>
        )
      })}
    </div>
  )
}

