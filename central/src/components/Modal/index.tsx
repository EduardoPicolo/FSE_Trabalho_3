import {
  Modal as ModalContainer,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ModalProps
} from '@chakra-ui/react'

export interface ModalPropss extends ModalProps {
  title: string | React.ReactNode
}

export const Modal: React.FC<ModalPropss> = ({ children, title, ...props }) => {
  return (
    <ModalContainer {...props}>
      <ModalOverlay
        bg="blackAlpha.300"
        backdropFilter="blur(5px) hue-rotate(90deg)"
      />
      <ModalContent padding={2}>
        <ModalHeader>{title}</ModalHeader>
        <ModalBody>{children}</ModalBody>
      </ModalContent>
    </ModalContainer>
  )
}
