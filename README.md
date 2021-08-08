This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/import?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

// react angular vue backbone 

// ant-design material 

1. 标题

1. 登录表格
	- 单选button group
	- 文本框 email password
	- checkout box
	- button 
	- sign up  link

1. process
	用户输入的时候需要校验
		radio group 必选  role
		email 符合email 格式
		password 4 - 16 字符 数字、字母，下划线
	click sign
		发起网络请求 ？api url 'xxxxx/api/login',  {
				"email": "string",
				"password": "string",
				"role": "manager"
			}
		response  success ------> 进入dashboard 页面; 保存 user info , localStorage
			  failed -------> 提示失败
