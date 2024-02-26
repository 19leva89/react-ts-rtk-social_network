import React from "react"

import { Login } from "../../features/user/login"
import { Register } from "../../features/user/register"
import { Card, CardBody, Tab, Tabs } from "@nextui-org/react"

export const AuthPage = () => {
  const [selected, setSelected] = React.useState("login")

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex flex-col">
        <Card className="max-w-full w-[340px] h-[450px]">
          <CardBody className="overflow-hidden">
            <Tabs
              fullWidth
              size="md"
              selectedKey={selected}
              onSelectionChange={key => setSelected(key as string)}
            >
              <Tab key="login" title="Вхід">
                <Login setSelected={setSelected} />
              </Tab>

              <Tab key="sign-up" title="Реєстрація">
                <Register setSelected={setSelected} />
              </Tab>
            </Tabs>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}
