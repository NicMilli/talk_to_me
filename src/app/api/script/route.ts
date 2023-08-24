import { getDBUser } from '@/utils/auth'
import { prisma } from '@/utils/db'
import { NextResponse } from 'next/server'

export const POST = async (urlParams: string) => {
  //const Participants = mongoose.model('participants')
  let data
  await dbConnect()
  if (urlParams === '1h') {
    const lowerRange = new Date(Date.now() - 60 * 60 * 1000)
    data = await Participants.find(
      {
        date: { $gt: lowerRange, $lt: Date.now() },
      },
      { date: 1, signups: 1, _id: 0 }
    )
      .lean()
      .exec()
  } else {
    let lowerRange
    let sortObj
    let groupObj
    let upperRange

    if (urlParams === '24h') {
      lowerRange = new Date(Date.now() - 24 * 60 * 60 * 1000)
      lowerRange.setHours(0, 0, 0, 0)
      upperRange = new Date(Date.now())
      sortObj = {
        $dateFromParts: {
          year: '$_id.year',
          month: '$_id.month',
          day: '$_id.day',
          hour: '$_id.hour',
          minute: 0,
          second: 0,
          millisecond: 0,
        },
      }
      groupObj = {
        year: { $year: '$date' },
        month: { $month: '$date' },
        day: { $dayOfMonth: '$date' },
        hour: { $hour: '$date' },
      }
    } else if (urlParams === '' || urlParams === '30d' || urlParams === '60d') {
      const rangeModifier =
        urlParams === '60d'
          ? 60 * 24 * 60 * 60 * 1000
          : 30 * 24 * 60 * 60 * 1000
      lowerRange = new Date(Date.now() - rangeModifier)
      lowerRange = new Date(
        Date.UTC(
          lowerRange.getUTCFullYear(),
          lowerRange.getUTCMonth(),
          lowerRange.getUTCDate(),
          0,
          0,
          0
        )
      )
      const now = new Date(Date.now())
      upperRange = new Date(
        Date.UTC(
          now.getUTCFullYear(),
          now.getUTCMonth(),
          now.getUTCDate() + 1,
          0,
          0,
          0
        )
      )
      sortObj = {
        $dateFromParts: {
          year: '$_id.year',
          month: '$_id.month',
          day: '$_id.day',
          hour: 0,
          minute: 0,
          second: 0,
          millisecond: 0,
        },
      }
      groupObj = {
        year: { $year: '$date' },
        month: { $month: '$date' },
        day: { $dayOfMonth: '$date' },
      }
    }

    data = await Participants.aggregate([
      {
        $match: {
          date: { $gt: lowerRange, $lt: upperRange },
        },
      },
      {
        $group: {
          _id: groupObj,
          signups: { $sum: '$signups' },
        },
      },
      {
        $project: {
          _id: 0,
          date: sortObj,
          signups: 1,
        },
      },
      {
        $sort: {
          date: 1,
        },
      },
    ])
  }
  return NextResponse.json({ data })
}
