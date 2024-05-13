import { useEffect, useState } from 'react'
import { NextPage } from 'next'
import Image from 'next/image'
import Head from 'next/head'
import Input from '../components/form-elements/input'
import Select from '../components/form-elements/select'
import Button from '../components/form-elements/button'
import Header from '../components/header'
import { usePrepareContractWrite, useContractWrite, useWaitForTransaction } from 'wagmi'
import { useToast } from '@chakra-ui/react'
import { contractAddress } from '@/utils/constant'
import { contractABI } from '@/utils/contractABI'


const Register: NextPage = () => {
  const [name, setName] = useState('');
  const [role, setRole] = useState(0);
  const [email, setEmail] = useState('');
  const toast = useToast()

  const roles = [
    { name: 'Manufacturer', value: 'manufacturer' },
    { name: 'Distributor', value: 'distributor' },
  ]
  const { config } = usePrepareContractWrite({
    address: contractAddress,
    abi: contractABI,
    functionName: 'addUser',
    args: [name, email, role],
  })
  const { data, write } = useContractWrite(config)

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  })

  useEffect(() => {
    if (isSuccess) {
      toast({
        title: "User Registered",
        description: "User has been registered successfully",
        status: "success",
        duration: 9000,
        isClosable: true,
      })
    }
  }, [isSuccess])

  return (
    <>
      <Head>
        <title>Register</title>
        <meta name="description" content="LogChain - Register" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="px-4 md:px-0 mx-auto max-w-[1080px]">
        <div className="max-w-7xl mt-5 pt-5 pb-5 mx-auto">
          <Header heading="Register" />
          <div className="flex flex-col md:flex-row text-center w-full">
            <div className="w-full md:w-1/2 mb-10 md:mb-0 md:p-4 overflow-x-hidden overflow-y-auto md:inset-0 justify-center flex md:h-full">
              <div className="relative w-full h-full md:h-auto">
                <div className="relative rounded-lg shadow-lg backdrop-blur-lg bg-white/30 bg-opacity-40 dark:bg-gray-700/40">
                  <div className="px-6 py-6 lg:px-8">
                    <form className="space-y-6">
                      <Input
                        id="name"
                        name="name"
                        label="Name"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                      <Input
                        id="email"
                        name="email"
                        label="E-mail"
                        placeholder="E-mail"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                      <Select
                        id="roles"
                        name="roles"
                        label="Roles"
                        placeholder="Select role"
                        options={roles}
                        onChange={(event: any) => {
                          console.log(event.target.selectedIndex);
                          setRole(event.target.selectedIndex == 1 ? 0 : 1)
                        }}
                      />
                      <Button label="Register" onClick={() => {
                        write?.()
                      }} />
                    </form>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <Image src="/authorised.png" className="ml-32 -mt-5" width="400" height="400" alt="Register" />
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

export default Register