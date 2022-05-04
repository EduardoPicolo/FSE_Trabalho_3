import {
  Modal as ModalContainer,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ModalProps
} from '@chakra-ui/react'

export interface ModalPropss extends ModalProps {
  title: string
}

export const Modal: React.FC<ModalPropss> = ({ children, title, ...props }) => {
  return (
    <ModalContainer {...props}>
      <ModalOverlay
        bg="blackAlpha.300"
        backdropFilter="blur(9px) hue-rotate(90deg)"
      />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalBody>{children}</ModalBody>
      </ModalContent>
    </ModalContainer>
  )
}
