"use client"

import { z } from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import { contactScheme } from '@/lib/validation';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { useForm } from 'react-hook-form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Send } from 'lucide-react';
import { text } from 'stream/consumers';
import { toast } from 'sonner';
import { useState } from 'react';

function ContactForm() {
  const [isLoading, setisLoading] = useState(false);

  const form = useForm<z.infer<typeof contactScheme>>({
    resolver: zodResolver(contactScheme),
    defaultValues: {
      email: '',
      message: '',
      name: '',
    }
  })

  function onSubmit(values: z.infer<typeof contactScheme>) {
    setisLoading(true)
    const telegramBotId = process.env.NEXT_PUBLIC_TELEGRAM_BOT_API!
    const telegramChatId = process.env.NEXT_PUBLIC_TELEGRAM_CHAT_ID!

    const promies = fetch(`https://api.telegram.org/bot${telegramBotId}/sendMessage`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Cache-control': 'no-cache',
      },
      body: JSON.stringify({
        chat_id: telegramChatId,
        text: `Name: ${values.name}\nEmail: ${values.email}\nMessage: ${values.message}`
      }),
    }
    ).then(() => form.reset()).finally(() => setisLoading(false))
    toast.promise(promies, {
      loading: "Loading...",
      success: "Successfully sent!",
      error: "Someathing went wrong!",
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-3'>
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  disabled={isLoading}
                  className='resize-none h-32'
                  placeholder='Ask question or just say Hi'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder='Email address' disabled={isLoading} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder='Your name here' disabled={isLoading} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className='w-fit' size={'lg'} type='submit' disabled={isLoading}>
          <span>Send</span>
          <Send className='w-4 h-4 ml-2' />
        </Button>
      </form>
    </Form>
  )
}

export default ContactForm