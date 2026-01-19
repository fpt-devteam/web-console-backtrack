export type ItemStatus = 'New' | 'Storage' | 'Claimed' | 'Disposed'
export type ItemCategory = 'Electronics' | 'Clothing' | 'Personal Items' | 'Food & Drink'
import laptopImage from '@/modules/console/assets/staff/items/laptop.png'
import shoeImage from '@/modules/console/assets/staff/items/red_sneaker.png'
import booksImage from '@/modules/console/assets/staff/items/history_book.png'
import tumblerImage from '@/modules/console/assets/staff/items/tumbler.png'
import phoneImage from '@/modules/console/assets/staff/items/ip14.png'
import walletImage from '@/modules/console/assets/staff/items/leather_wallet.png'
import backpackImage from '@/modules/console/assets/staff/items/blue_backpack.png'
import airpodsImage from '@/modules/console/assets/staff/items/airpod.png' 

export interface InventoryItem {
  id: string
  title: string
  category: ItemCategory
  status: ItemStatus
  image: string
  date: string
  time: string
  location: string
  bin: string
  claimedBy?: string
  recycled?: boolean
}

export const mockInventoryItems: InventoryItem[] = [
  {
    id: '41EM-2023-888',
    title: 'Dell XPS 13 Laptop',
    category: 'Electronics',
    status: 'New',
    image: laptopImage,
    date: 'Today',
    time: '10:30 AM',
    location: 'Lobby Reception',
    bin: 'A-12',
  },
  {
    id: '41EM-2023-842',
    title: 'Red Nike Sneaker (Left)',
    category: 'Clothing',
    status: 'Storage',
    image: shoeImage,
    date: 'Oct 24',
    time: '2:15 PM',
    location: 'Bin A-12',
    bin: 'A-12',
  },
  {
    id: '41EM-2023-628',
    title: 'Set of History Books',
    category: 'Personal Items',
    status: 'Claimed',
    image: booksImage,
    date: 'Oct 22',
    time: '9:47 AM',
    location: 'Claimed by John D.',
    bin: '',
    claimedBy: 'John D.',
  },
  {
    id: '41EM-2023-ms',
    title: 'Starbucks Tumbler',
    category: 'Food & Drink',
    status: 'Disposed',
    image: tumblerImage,
    date: 'Sep 18',
    time: '11:20 AM',
    location: 'Recycled',
    bin: '',
    recycled: true,
  },
  {
    id: '41EM-2023-777',
    title: 'iPhone 14 Pro',
    category: 'Electronics',
    status: 'New',
    image: phoneImage,
    date: 'Today',
    time: '3:45 PM',
    location: 'Conference Room B',
    bin: 'B-05',
  },
  {
    id: '41EM-2023-654',
    title: 'Black Leather Wallet',
    category: 'Personal Items',
    status: 'Storage',
    image: walletImage,
    date: 'Oct 23',
    time: '1:20 PM',
    location: 'Bin C-08',
    bin: 'C-08',
  },
  {
    id: '41EM-2023-521',
    title: 'Blue Backpack',
    category: 'Personal Items',
    status: 'Claimed',
    image: backpackImage,
    date: 'Oct 21',
    time: '4:30 PM',
    location: 'Claimed by Sarah M.',
    bin: '',
    claimedBy: 'Sarah M.',
  },
  {
    id: '41EM-2023-445',
    title: 'AirPods Pro',
    category: 'Electronics',
    status: 'Storage',
    image: airpodsImage,
    date: 'Oct 20',
    time: '10:15 AM',
    location: 'Bin A-03',
    bin: 'A-03',
  },
]

export const locations = [
  'All',
  'Main Warehouse',
  'Lobby Reception',
  'Conference Room A',
  'Conference Room B',
  'Storage Room',
]

export const categories = [
  'All',
  'Electronics',
  'Clothing',
  'Personal Items',
  'Food & Drink',
]

export const statuses = ['All', 'New', 'Storage', 'Claimed', 'Disposed']

