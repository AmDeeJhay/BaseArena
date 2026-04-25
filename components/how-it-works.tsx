import { CheckCircle, FileCheck, Trophy, Upload } from "lucide-react"

export default function HowItWorks() {
  const steps = [
    {
      icon: <FileCheck className="h-8 w-8 text-teal-600 dark:text-teal-400" />,
      title: "Choose a Challenge",
      description: "Browse through community-posted skill challenges that match your interests and expertise.",
    },
    {
      icon: <Upload className="h-8 w-8 text-teal-600 dark:text-teal-400" />,
      title: "Submit Your Work",
      description:
        "Complete the challenge and submit your workproof - code, video, article, design, or other deliverables.",
    },
    {
      icon: <CheckCircle className="h-8 w-8 text-teal-600 dark:text-teal-400" />,
      title: "Get Verified",
      description: "AI and the community verify your submission based on the challenge requirements.",
    },
    {
      icon: <Trophy className="h-8 w-8 text-teal-600 dark:text-teal-400" />,
      title: "Earn Rewards",
      description: "Receive on-chain rewards and a Skill NFT badge that's added to your public portfolio.",
    },
  ]

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-white dark:bg-gray-950">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">How It Works</h2>
            <p className="max-w-[900px] text-gray-500 dark:text-gray-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              BaseSkill makes it easy to prove your skills and earn rewards on the Base blockchain.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="relative mb-4">
                <div className="w-16 h-16 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center">
                  {step.icon}
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-teal-200 dark:bg-teal-800 -translate-y-1/2">
                    <div className="absolute right-0 w-2 h-2 rounded-full bg-teal-400 dark:bg-teal-600 -translate-y-1/2"></div>
                  </div>
                )}
              </div>
              <h3 className="text-xl font-bold mb-2">{step.title}</h3>
              <p className="text-gray-500 dark:text-gray-400">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
