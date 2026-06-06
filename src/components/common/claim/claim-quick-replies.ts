/** A pre-written reply staff can drop into the chat composer with one tap. */
export interface QuickReply {
  /** Short label shown on the chip. */
  label: string
  /** Full message inserted into the composer (staff can still edit before sending). */
  text: string
  /** Optional group label; chips sharing a section render together under it. */
  section?: string
}

/**
 * Vietnamese quick replies for common lost-and-found claim situations.
 * Tapping a chip fills the composer so staff can tweak it before sending.
 */
export const CLAIM_QUICK_REPLIES: QuickReply[] = [
  {
    label: 'Chào hỏi',
    text: 'Chào quý khách, cảm ơn quý khách đã liên hệ. Rất hân hạnh được hỗ trợ quý khách với yêu cầu tìm đồ thất lạc.',
  },
  {
    label: 'Chưa tìm thấy',
    text: 'Hiện chúng tôi vẫn chưa tìm thấy đồ vật có đặc điểm như quý khách mô tả. Chúng tôi thành thật xin lỗi vì chưa thể hỗ trợ quý khách tốt hơn trong tình huống này. Thông tin của quý khách sẽ được lưu giữ trên hệ thống để đối chiếu nếu có người nhặt được và bàn giao lại sau đó. Rất hân hạnh được hỗ trợ quý khách.',
  },
  {
    label: 'Đã tìm thấy',
    text: 'Chúng tôi đã tìm thấy một món đồ có đặc điểm tương tự như quý khách mô tả. Quý khách có thể đến quầy thông tin để kiểm tra và nhận lại đồ vật của mình. Rất hân hạnh được hỗ trợ quý khách.',
  },
  {
    label: 'Cảm ơn',
    text: 'Cảm ơn quý khách đã liên hệ. Rất hân hạnh được hỗ trợ quý khách. Chúc quý khách một ngày tốt lành!',
  },
]
