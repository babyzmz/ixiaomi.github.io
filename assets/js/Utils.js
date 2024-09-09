export default {
  getJpDay(n) {
    const days = ['日', '月', '火', '水', '木', '金', '土']
    return days[n]
  },

  // 現在時刻を基準として、引数で受け取った日付との差の日数を返す
  getDiffFromToday(year, month, date) {
    const diff = (new Date(year, month, date).getTime() - new Date().getTime()) / (24 * 60 * 60 * 1000)
    return Math.ceil(diff)
  }
}
