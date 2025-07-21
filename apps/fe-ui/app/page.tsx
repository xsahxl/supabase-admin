import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AuthButton } from '@/components/auth-button'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function Index() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect('/auth/login')
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
      <div className="animate-in flex-1 flex flex-col gap-20 opacity-0 max-w-4xl px-3">
        <div className="flex-1 flex flex-col gap-6">
          <h1 className="text-2xl font-bold">欢迎使用企业管理系统</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>企业管理</CardTitle>
                <CardDescription>
                  管理企业信息，包括企业名称、Logo、描述、地址等
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">功能</Badge>
                    <span>企业 CRUD 操作</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">搜索</Badge>
                    <span>支持企业名称和描述搜索</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">分页</Badge>
                    <span>支持分页浏览</span>
                  </div>
                  <Link href="/companies">
                    <Button className="w-full">
                      进入企业管理
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>用户信息</CardTitle>
                <CardDescription>
                  当前登录用户的基本信息
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">邮箱</p>
                    <p className="font-medium">{user?.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">用户 ID</p>
                    <p className="font-medium text-sm">{user?.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">最后登录</p>
                    <p className="font-medium">
                      {user?.last_sign_in_at
                        ? new Date(user.last_sign_in_at).toLocaleString('zh-CN')
                        : '未知'
                      }
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}